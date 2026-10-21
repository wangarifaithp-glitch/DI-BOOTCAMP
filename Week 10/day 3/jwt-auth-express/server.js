const app = require('./src/app')
const { port } = require('./src/config')

app.listen(port, () => {
  console.log(`JWT auth API listening on http://localhost:${port}`)
})