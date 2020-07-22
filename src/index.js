const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

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
    socket.broadcast.emit('welcome', 'A new User has joined!')

    //on setup un callback pour l'accusé de réception coté client pour SendMessage
    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()
        if (filter.isProfane(message)){
            return callback('bad-words is not allow')
        }
        io.emit('messageUpdated', message)
        callback()
    })

    // déclencher un événement quand un client se deconnecte
    socket.on('disconnect', () => {
        io.emit('disconnect', 'a user has left')
    })

    socket.on('sendLocation', (coord, callback) => {
        socket.broadcast.emit('location', 'https://www.google.com/maps?q='+coord.latitude+','+coord.longitude)
        callback()
    })
})


app.get('/', (req, res) => {
    res.render('html/index.html')
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})