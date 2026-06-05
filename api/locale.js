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

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { error: 'Method Not Allowed' })
  }

  const country = countryFromHeaders(req)

  sendJson(res, 200, {
    country,
    language: country === 'CN' ? 'zh' : 'en',
    source: country ? 'header' : 'fallback'
  })
}
