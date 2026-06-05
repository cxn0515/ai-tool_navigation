const fs = require('node:fs')
const path = require('node:path')
const { query } = require('../api/_db')

const MAX_BYTES = 512 * 1024
const TIMEOUT_MS = 2500
const CONCURRENCY = 24

const TYPE_EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico'
}

const LOCAL_EXTENSIONS = ['png', 'webp', 'jpg', 'jpeg', 'ico', 'gif']

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const index = trimmed.indexOf('=')
    if (index === -1) {
      continue
    }

    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

function baseName(tool) {
  const slug = String(tool.slug || 'tool')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return `${tool.id}-${slug || 'tool'}`
}

function normalizeUrl(value) {
  if (!value) {
    return null
  }
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

function hostname(value) {
  try {
    return new URL(value).hostname
  } catch {
    return null
  }
}

function candidates(tool) {
  const host = hostname(tool.url)
  const directIcon = normalizeUrl(tool.icon_url)
  const urls = []

  if (directIcon) {
    urls.push(directIcon)
  }
  if (host) {
    urls.push(`https://logo.clearbit.com/${host}`)
    urls.push(`https://favicone.com/${host}?s=256`)
    urls.push(`https://www.fav.dog/i/${host}.ico`)
    urls.push(`https://favicon.im/${host}?larger=true`)
    urls.push(`https://icons.duckduckgo.com/ip3/${host}.ico`)
    urls.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256`)
    urls.push(`https://www.google.com/s2/favicons?domain_url=https://${encodeURIComponent(host)}&sz=256`)
    urls.push(`https://${host}/favicon.ico`)
    urls.push(`https://${host}/favicon.png`)
  }

  return [...new Set(urls)]
}

function extensionFromContentType(contentType) {
  const normalized = contentType.split(';')[0].trim().toLowerCase()
  return TYPE_EXTENSIONS[normalized] || null
}

function extensionFromBytes(bytes) {
  if (bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47) {
    return 'png'
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg'
  }
  if (bytes.length >= 12
    && bytes.toString('ascii', 0, 4) === 'RIFF'
    && bytes.toString('ascii', 8, 12) === 'WEBP') {
    return 'webp'
  }
  if (bytes.length >= 6 && bytes.toString('ascii', 0, 6).startsWith('GIF')) {
    return 'gif'
  }
  if (bytes.length >= 4 && bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) {
    return 'ico'
  }
  return null
}

function existingLocalIcon(iconsDir, tool) {
  const name = baseName(tool)
  for (const extension of LOCAL_EXTENSIONS) {
    const fileName = `${name}.${extension}`
    if (fs.existsSync(path.join(iconsDir, fileName))) {
      return `/icons/${fileName}`
    }
  }
  return null
}

async function fetchIcon(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent': 'AINavCloud Icon Downloader/1.0'
      }
    })

    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get('content-type') || ''
    const arrayBuffer = await response.arrayBuffer()
    const bytes = Buffer.from(arrayBuffer)

    if (bytes.length === 0 || bytes.length > MAX_BYTES) {
      return null
    }

    const extension = extensionFromContentType(contentType) || extensionFromBytes(bytes)
    if (!extension) {
      return null
    }

    return { bytes, extension, source: url }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env.local'))
  loadEnvFile(path.join(process.cwd(), '.env'))

  const iconsDir = path.join(process.cwd(), 'frontend', 'public', 'icons')
  fs.mkdirSync(iconsDir, { recursive: true })

  const result = await query(`
    select id, slug, name, url, icon_url
    from ai_tools
    order by id asc
  `)

  const manifest = {}
  const failures = []

  async function downloadTool(tool) {
    const existing = existingLocalIcon(iconsDir, tool)
    if (existing) {
      return {
        ok: true,
        slug: tool.slug,
        path: existing,
        source: 'local'
      }
    }

    let icon = null
    for (const candidate of candidates(tool)) {
      icon = await fetchIcon(candidate)
      if (icon) {
        break
      }
    }

    if (!icon) {
      return { ok: false, tool }
    }

    const fileName = `${baseName(tool)}.${icon.extension}`
    const filePath = path.join(iconsDir, fileName)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, icon.bytes)
    }
    return {
      ok: true,
      slug: tool.slug,
      path: `/icons/${fileName}`,
      source: icon.source
    }
  }

  for (let index = 0; index < result.rows.length; index += CONCURRENCY) {
    const batch = result.rows.slice(index, index + CONCURRENCY)
    const settled = await Promise.all(batch.map(downloadTool))
    for (const item of settled) {
      if (item.ok) {
        manifest[item.slug] = {
          path: item.path,
          source: item.source
        }
      } else {
        failures.push({
          slug: item.tool.slug,
          name: item.tool.name,
          url: item.tool.url
        })
      }
    }
    console.log(`Processed ${Math.min(index + CONCURRENCY, result.rows.length)}/${result.rows.length}`)
  }

  fs.writeFileSync(
    path.join(iconsDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  )
  fs.writeFileSync(
    path.join(iconsDir, 'failures.json'),
    `${JSON.stringify(failures, null, 2)}\n`,
    'utf8'
  )

  console.log(`Downloaded ${Object.keys(manifest).length}/${result.rows.length} real icons`)
  if (failures.length > 0) {
    console.log(`Failed ${failures.length}; see frontend/public/icons/failures.json`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
