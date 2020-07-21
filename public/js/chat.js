const socket = io()

// quand le message est rendu cela veut dire que le serveur
// envoit des informations au client
socket.on('countUpdated', () => {

    console.log('the count has been updated!')
})