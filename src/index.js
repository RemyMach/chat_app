const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')

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

    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room})
        if(error){
            return callback(error)
        }
        // permet de créer des room, et de faire rejoindre le client dans la room
        socket.join(user.room)

        socket.emit('welcome', generateMessage('Welcome!'))
        //envoie l'evénement à tous les cleints dans la room sauf le client qui a join
        socket.broadcast.to(user.room).emit('welcome', generateMessage(`${user.username} has joined`))
    })
    //socket.emit('welcome', generateMessage('Welcome !'))

    // pour envoyer un message à tous les utilisateurs sauf l'utilisateur
    // qui vient de se connecter donc celui qui correspond à Socket
    //socket.broadcast.emit('welcome', generateMessage('A new User has joined!'))

    //on setup un callback pour l'accusé de réception coté client pour SendMessage
    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()
        if (filter.isProfane(message)){
            return callback('bad-words is not allow')
        }
        io.emit('messageUpdated', generateMessage(message))
        callback()
    })

    // déclencher un événement quand un client se deconnecte
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('disconnect', generateMessage(`${user.username} has left the room ${user.room}`))
        }
    })

    socket.on('sendLocation', (coord, callback) => {
        socket.broadcast.emit('location', generateLocationMessage('https://www.google.com/maps?q='+coord.latitude+','+coord.longitude))
        callback()
    })
})


app.get('/', (req, res) => {
    res.render('html/index.html')
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})