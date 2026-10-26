const fs = require('node:fs/promises')
const path = require('node:path')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

async function initializeDatabase() {
  const schema = await fs.readFile(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8')
  await pool.query(schema)
  await pool.query('ALTER TABLE stories ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT \'Fiction\'')
}

module.exports = { pool, initializeDatabase }
