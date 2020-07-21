const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
// quand on ne le fait pas, c'est quelque chose qui est fait en back
const server = http.createServer(app)
// on le crée comme cela pour pouvoir le passer au serveur
const io = socketio(server)

app.use(express.json())
const port = process.env.PORT || 3000


const publicDirectoryPath = path.join(__dirname, '../public/')
app.use('/',express.static(publicDirectoryPath))

let count = 0

// message qui appartaitra à chaque fois que un nouveau client 
// se connecte au serveur
io.on('connection', (socket) => {
    console.log('connection')

    // envoyer des informations au client
    socket.emit('countUpdated')
})

app.get('/', (req, res) => {
    res.render('html/index.html')
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})