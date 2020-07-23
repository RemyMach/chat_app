const socket = io()

const field = document.querySelector("#message-text")
const form = document.querySelector('#message-form')
const button = form.querySelector('button')
const messages = document.querySelector('#messages')

//template js
const messageTemplate = document.querySelector('#message-template').innerHTML
const linkTemplate = document.querySelector('#link-template').innerHTML
const siedbarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoscroll = () => {
    // New message element
    const $newMessage = messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = messages.offsetHeight

    // height of messages container
    const containerHeight = messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight

    // on vérifie que la bar de scroll etait bien en bas si on veut scroll
    // car sinon on regardait l'historique des messages et on ne veut pas être ramené en bas
    if (containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }

    //console.log(newMessageStyles)
}

// options
// récupère tout ce qui est passée dans l'url
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

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

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('messageUpdated', (message) => {

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate)
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('location', (location) => {
    console.log(location)
    const html = Mustache.render(linkTemplate, {
        username: location.username,
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('disconnect', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(siedbarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})