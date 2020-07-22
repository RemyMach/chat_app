const socket = io()

const field = document.querySelector("#message-text")
const form = document.querySelector('#message-form')
const button = form.querySelector('button')
const messages = document.querySelector('#messages')

//template js
const messageTemplate = document.querySelector('#message-template').innerHTML
const linkTemplate = document.querySelector('#link-template').innerHTML

form.addEventListener('submit', (e) => {
    // empêcher le formulaire de s'envoyer
    e.preventDefault()

    button.setAttribute('disabled', 'disabled')
    //pour récupérer l'input depuis son name message
    const message = e.target.elements.message.value
    // le troisième argument représente l'accusé de réception
    // message reception représente le message envoyé par le serveur pour l'accusé de réception
    // messgaeRecpetion est maintenant error
    socket.emit('sendMessage', message, (error) => {
        
    
        button.removeAttribute('disabled')
        field.value = ''
        // mettre le focus sur le bouton
        field.focus()
        //enable button

        if (error) {
            return console.log(error)
        }
        console.log('the message has been delivered')
    })
})

document.querySelector("#send-location").addEventListener('click', (button_location) => {
        
    if (!navigator.geolocation){
        return alert('Geolocation is not support by your browser')
    }

    button_location.srcElement.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const coord = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }

        socket.emit('sendLocation', coord, () => {

            button_location.srcElement.removeAttribute('disabled')
            console.log('the location has been shared!')
        })
    })
})

socket.on('welcome', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('messageUpdated', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate)
    messages.insertAdjacentHTML('beforeend', html)
})


socket.on('location', (location) => {
    console.log(location)
    const html = Mustache.render(linkTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('disconnect', (message) => {
    console.log(message.text)
})