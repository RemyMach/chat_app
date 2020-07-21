const socket = io()

const field = document.querySelector("#message-text")
const form = document.querySelector('#message-form')

form.addEventListener('submit', (e) => {
    // empêcher le formulaire de s'envoyer
    e.preventDefault()
    //pour récupérer l'input depuis son name message
    const message = e.target.elements.message.value
    // le troisième argument représente l'accusé de réception
    // message reception représente le message envoyé par le serveur pour l'accusé de réception
    socket.emit('sendMessage', message, (messageReception) => {
        console.log('the message has been delivered', messageReception)
    })
})

document.querySelector("#send-location").addEventListener('click', () => {
    if (!navigator.geolocation){
        return alert('Geolocation is not support by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const coord = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }

        socket.emit('sendLocation', coord)
    })
})

socket.on('welcome', (message) => {
    console.log(message)
})

socket.on('messageUpdated', (message) => {
    console.log(message)
})

socket.on('message', (message) => {
    console.log(message)
})

socket.on('location', (location) => {
    console.log(location)
})