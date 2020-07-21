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

// server (emit) an event -> client (receive) - countUpdated
// client (emit) an event -> server (receive) - increment

// message qui appartaitra à chaque fois que un nouveau client 
// se connecte au serveur
io.on('connection', (socket) => {
    console.log('connection')

    socket.emit('welcome', 'Welcome !')

    // pour envoyer un message à tous les utilisateurs sauf l'utilisateur
    // qui vient de se connecter donc celui qui correspond à Socket
    socket.broadcast.emit('message', 'A new User has joined!')

    socket.on('sendMessage', (message) => {
        io.emit('messageUpdated', message)
    })

    // déclencher un événement quand un client se deconnecte
    socket.on('disconnect', () => {
        io.emit('message', 'a user has left')
    })

    socket.on('sendLocation', (coord) => {
        socket.broadcast.emit('location', coord)
    })
})


app.get('/', (req, res) => {
    res.render('html/index.html')
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})