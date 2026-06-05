import { fallbackCategories, fallbackTools } from './fallbackData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:8080')
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 4000)

async function request(path) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
    if (!response.ok) {
      throw new Error(`API ${response.status}`)
    }
    return response.json()
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function withLang(path, lang) {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}lang=${encodeURIComponent(lang)}`
}

export async function fetchCategories(lang = 'zh', fallback = fallbackCategories) {
  try {
    return await request(withLang('/api/categories', lang))
  } catch (error) {
    console.warn('Using fallback categories:', error)
    return fallback
  }
}

export async function fetchTools(lang = 'zh', fallback = fallbackTools) {
  try {
    return await request(withLang('/api/tools', lang))
  } catch (error) {
    console.warn('Using fallback tools:', error)
    return fallback
  }
}

export async function fetchLocale() {
  try {
    return await request('/api/locale')
  } catch (error) {
    console.warn('Using locale fallback:', error)
    return null
  }
}

export async function fetchBrowserLocale() {
  const locale = navigator.language || ''
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  const language = locale.toLowerCase().includes('zh-cn') || timezone === 'Asia/Shanghai' ? 'zh' : 'en'

  return {
    country: '',
    language,
    source: 'browser'
  }
}
