const { sendJson } = require('./_db')

function countryFromHeaders(req) {
  const headers = req.headers || {}
  return (
    headers['x-vercel-ip-country']
    || headers['cf-ipcountry']
    || headers['x-country-code']
    || headers['x-appengine-country']
    || ''
  ).toString().toUpperCase()
}

async function countryFromPublicIp() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 2000)

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) {
      return ''
    }

    const body = await response.json()
    return String(body.country_code || '').toUpperCase()
  } catch {
    return ''
  } finally {
    clearTimeout(timer)
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { error: 'Method Not Allowed' })
  }

  const headerCountry = countryFromHeaders(req)
  const country = headerCountry || await countryFromPublicIp()

  sendJson(res, 200, {
    country,
    language: country === 'CN' ? 'zh' : 'en',
    source: headerCountry ? 'header' : country ? 'ip' : 'fallback'
  })
}
