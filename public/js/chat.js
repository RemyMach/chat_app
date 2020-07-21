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


socket.on('welcome', (message) => {
    console.log(message)
})

socket.on('messageUpdated', (message) => {
    console.log(message)
})

socket.on('message', (message) => {
    console.log(message)
})