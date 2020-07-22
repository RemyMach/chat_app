const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    // findIndex cherchera tant qu'il reste des users et s'arrétera quand elle retournera true
    // et on récupère l'index de la ligne qui est égale à true
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {

    return users.find((user) => user.id === id)
        // équivaut à
        // if (user.id === id){
        //     return user
        // }
}

const getUsersInRoom = (room) => {

    return users.filter((user) => user.room === room)
    // équivaut à
//     result = []
//     const usersRoom = users.find((user) => {
//         if (user.room === room){
//             result.push(user)
//         }
//     })

//    return result
}

addUser({
    id: 22,
    username: 'Andrew  ',
    room: '  South Philly'
})

addUser({
    id: 12,
    username: 'jean',
    room: 'ici'
})

addUser({
    id: 1,
    username: 'imotepe',
    room: 'ici'
})

console.log(getUser(12))

console.log(getUsersInRoom('ici'))


console.log(users)

const removedUser = removeUser(22)

console.log(removedUser)
console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}