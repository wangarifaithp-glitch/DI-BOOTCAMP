const http = require('http')

const server = http.createServer((req, res) => {
    // Send response
    res.end('Hello World from the server')
})

server.listen(8080, 'localhost', () => {
    console.log('Server is listening at localhost ona port 8080')
})