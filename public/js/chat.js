const socket = io()

// quand le message est rendu cela veut dire que le serveur
// envoit des informations au client
// count est passé en deuxième arg dans le serveur
// socket.on('countUpdated', (count) => {

//     console.log('the count has been updated! ' + count)
// })
const field = document.querySelector("#message-text")
const form = document.querySelector('#message-form')

form.addEventListener('submit', (e) => {
    // empêcher le formulaire de s'envoyer
    e.preventDefault()
    socket.emit('sendMessage', field.value)
})


socket.on('welcome', (message) => {
    console.log(message)
})

socket.on('messageUpdated', (message) => {
    console.log(message)
})