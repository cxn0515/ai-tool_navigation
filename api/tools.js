const { query, sendError, sendJson } = require('./_db')
const { localizeTool, normalizeLang } = require('./_i18n')
const fs = require('node:fs')
const path = require('node:path')

let iconManifest

function localIconUrl(tool) {
  if (!iconManifest) {
    try {
      const manifestPath = path.join(process.cwd(), 'frontend', 'public', 'icons', 'manifest.json')
      iconManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    } catch {
      iconManifest = {}
    }
  }

  const entry = iconManifest[tool.slug]
  return typeof entry === 'string' ? entry : entry?.path || ''
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { error: 'Method Not Allowed' })
  }

  const { category, q, featured } = req.query
  const lang = normalizeLang(req.query?.lang)
  const params = []
  const where = []

  if (typeof category === 'string' && category.trim()) {
    params.push(category.trim())
    where.push(`c.slug = $${params.length}`)
  }

  if (typeof featured === 'string' && featured.trim()) {
    params.push(featured.trim().toLowerCase() === 'true')
    where.push(`t.featured = $${params.length}`)
  }

  if (typeof q === 'string' && q.trim()) {
    params.push(`%${q.trim()}%`)
    where.push(`(
      t.name ilike $${params.length}
      or t.description ilike $${params.length}
      or t.pricing ilike $${params.length}
      or c.name ilike $${params.length}
      or exists (
        select 1
        from ai_tool_tags search_tags
        where search_tags.tool_id = t.id
          and search_tags.tag ilike $${params.length}
      )
    )`)
  }

  const whereSql = where.length ? `where ${where.join(' and ')}` : ''

  try {
    const result = await query(`
      select
        t.id,
        t.slug,
        t.name,
        t.description,
        t.url,
        t.icon_url as "iconUrl",
        t.pricing,
        t.featured,
        t.domestic,
        t.sort_order as "sortOrder",
        json_build_object(
          'id', c.id,
          'slug', c.slug,
          'name', c.name,
          'description', c.description,
          'icon', c.icon,
          'sortOrder', c.sort_order
        ) as category,
        coalesce(
          json_agg(tags.tag order by tags.tag_order) filter (where tags.tag is not null),
          '[]'::json
        ) as tags
      from ai_tools t
      join tool_categories c on c.id = t.category_id
      left join ai_tool_tags tags on tags.tool_id = t.id
      ${whereSql}
      group by t.id, c.id
      order by t.featured desc, c.sort_order asc, t.sort_order asc, t.name asc
    `, params)

    sendJson(res, 200, result.rows.map((tool) => localizeTool({
      ...tool,
      iconUrl: localIconUrl(tool)
    }, lang)))
  } catch (error) {
    sendError(res, error)
  }
}
