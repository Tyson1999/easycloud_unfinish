// One client one room
// https://stackoverflow.com/questions/38999157/using-socket-io-with-multiple-clients-connecting-to-same-server
const {Server} = require('socket.io')
const {getAllKeys, getItem} = require('../utils/redis')

/**
 * Create socket.io server.
 */
function createSocketIOServer(server) {
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    })
    let timer = null
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`)
        // io.sockets.sockets.get(socket.id).emit('Hello', 'World!')
        if (!timer) {
            timer = setInterval(async () => {
                const keys = await getAllKeys()
                const obj = await parseUploadStatus(keys)
                io.emit('uploadStatus', obj)
                if (io.sockets.sockets.size === 0) {
                    clearInterval(timer)
                    timer = null
                }
            }, 2000)
        }
    })
}

async function parseUploadStatus(keys) {
    const obj = {}
    for (const key of keys) {
        const progress = Number(await getItem(key))
        const fileId = key.split(':')[1]
        const policyName = key.split(':')[2]
        if (!obj[fileId]) {
            obj[fileId] = {}
        }
        if (!obj[fileId][policyName]) {
            obj[fileId][policyName] = {}
        }
        obj[fileId][policyName] = progress
    }
    return obj
}

module.exports = createSocketIOServer
