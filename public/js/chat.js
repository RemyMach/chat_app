const socket = io()

const field = document.querySelector("#message-text")
const form = document.querySelector('#message-form')

form.addEventListener('submit', (e) => {
    // empêcher le formulaire de s'envoyer
    e.preventDefault()
    //pour récupérer l'input depuis son name message
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
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

socket.on('location', (coord) => {
    console.log('longitude: ' + coord.longitude)
    console.log('latitude: ' + coord.latitude)

})