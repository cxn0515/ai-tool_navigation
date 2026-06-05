const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { URL } = require('node:url')

const routes = {
  '/api/health': require('../api/health'),
  '/api/locale': require('../api/locale'),
  '/api/categories': require('../api/categories'),
  '/api/tools': require('../api/tools')
}

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

loadEnvFile(path.join(process.cwd(), '.env.local'))
loadEnvFile(path.join(process.cwd(), '.env'))

function createResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode
    return res
  }
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(body))
  }
  return res
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const handler = routes[url.pathname]

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (!handler) {
    res.statusCode = 404
    res.end('Not Found')
    return
  }

  req.query = Object.fromEntries(url.searchParams.entries())
  Promise.resolve(handler(req, createResponse(res))).catch((error) => {
    console.error(error)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
    res.end(JSON.stringify({ error: 'Internal Server Error' }))
  })
})

const port = Number(process.env.PORT || 8080)
server.listen(port, () => {
  console.log(`Local API listening on http://127.0.0.1:${port}`)
})
