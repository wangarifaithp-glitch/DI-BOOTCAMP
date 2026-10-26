const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { Client } = require('pg')

const dataDirectory = path.join(__dirname, '..', '.local-postgres')
const logFile = path.join(dataDirectory, 'postgres.log')
const port = process.env.LOCAL_PG_PORT || '5433'
const binaryDirectory = process.env.PG_BIN || 'C:\\Program Files\\PostgreSQL\\18\\bin'

function run(binaryName, args) {
  const binary = path.join(binaryDirectory, `${binaryName}.exe`)
  if (!fs.existsSync(binary)) {
    throw new Error(`Could not find ${binary}. Set PG_BIN to your PostgreSQL bin directory.`)
  }
  const result = spawnSync(binary, args, { stdio: 'inherit', windowsHide: true })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`${binaryName} exited with code ${result.status}.`)
}

async function ensureDatabase() {
  const client = new Client({
    host: '127.0.0.1',
    port,
    user: 'story_circle',
    database: 'postgres',
  })
  try {
    await client.connect()
    const { rows } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', ['story_circle'])
    if (rows.length === 0) await client.query('CREATE DATABASE story_circle')
  } finally {
    await client.end()
  }
}

async function startLocalDatabase() {
  if (!fs.existsSync(path.join(dataDirectory, 'PG_VERSION'))) {
    fs.mkdirSync(dataDirectory, { recursive: true })
    run('initdb', [
      '-D', dataDirectory,
      '-U', 'story_circle',
      '--auth-local=trust',
      '--auth-host=trust',
      '--encoding=UTF8',
      '--no-locale',
    ])
  }

  const status = spawnSync(
    path.join(binaryDirectory, 'pg_ctl.exe'),
    ['-D', dataDirectory, 'status'],
    { stdio: 'ignore', windowsHide: true },
  )
  if (status.error) throw status.error
  if (status.status === 0) {
    console.log(`Local Story Circle database is already running on port ${port}.`)
  } else {
    run('pg_ctl', [
      '-D', dataDirectory,
      '-o', `-p ${port} -h 127.0.0.1`,
      '-l', logFile,
      '-w', 'start',
    ])
    console.log(`Local Story Circle database is running on 127.0.0.1:${port}.`)
  }
  await ensureDatabase()
  console.log(`Database "story_circle" is ready on 127.0.0.1:${port}.`)
}

startLocalDatabase().catch((error) => {
  console.error('Could not start the local Story Circle database:', error.message)
  process.exitCode = 1
})
