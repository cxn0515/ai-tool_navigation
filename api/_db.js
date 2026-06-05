const pg = require('pg')

const { Pool } = pg

let pool

function databaseUrl() {
  const rawUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL
  if (!rawUrl) {
    throw new Error('Missing SUPABASE_DB_URL or DATABASE_URL')
  }

  return rawUrl.startsWith('jdbc:postgresql://')
    ? rawUrl.replace('jdbc:postgresql://', 'postgresql://')
    : rawUrl
}

function dbConfig() {
  const url = new URL(databaseUrl())
  const username = process.env.SUPABASE_DB_USERNAME
  const password = process.env.SUPABASE_DB_PASSWORD

  if (username && !url.username) {
    url.username = username
  }
  if (password && !url.password) {
    url.password = password
  }

  return {
    connectionString: url.toString(),
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    ssl: { rejectUnauthorized: false }
  }
}

function getPool() {
  if (!pool) {
    pool = new Pool(dbConfig())
  }
  return pool
}

async function query(text, params = []) {
  return getPool().query(text, params)
}

function sendJson(res, statusCode, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  res.statusCode = statusCode
  res.end(JSON.stringify(body))
}

function sendError(res, error) {
  console.error(error)
  sendJson(res, 500, { error: 'Internal Server Error' })
}

module.exports = {
  query,
  sendJson,
  sendError
}
