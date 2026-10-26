require('dotenv').config()
const { initializeDatabase, pool } = require('./db')

initializeDatabase()
  .then(() => console.log('Story Circle database is ready.'))
  .catch((error) => {
    console.error('Could not initialize the database:', error.message)
    process.exitCode = 1
  })
  .finally(() => pool.end())
