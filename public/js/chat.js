const socket = io()

// quand le message est rendu cela veut dire que le serveur
// envoit des informations au client
// count est passé en deuxième arg dans le serveur
socket.on('countUpdated', (count) => {

    console.log('the count has been updated! ' + count)
})