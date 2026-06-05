const { query, sendError, sendJson } = require('./_db')
const { localizeCategory, normalizeLang } = require('./_i18n')

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { error: 'Method Not Allowed' })
  }

  try {
    const lang = normalizeLang(req.query?.lang)
    const result = await query(`
      select
        id,
        slug,
        name,
        description,
        icon,
        sort_order as "sortOrder"
      from tool_categories
      order by sort_order asc, name asc
    `)

    sendJson(res, 200, result.rows.map((category) => localizeCategory(category, lang)))
  } catch (error) {
    sendError(res, error)
  }
}
