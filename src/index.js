const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
// quand on ne le fait pas, c'est quelque chose qui est fait en back
const server = http.createServer(app)

app.use(express.json())
const port = process.env.PORT || 3000


const publicDirectoryPath = path.join(__dirname, '../public/')
app.use('/',express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('html/index.html')
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})