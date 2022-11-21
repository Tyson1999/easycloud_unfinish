const redis = require('redis')

let redisClient

(async () => {
    redisClient = redis.createClient({
        legacyMode: true
    })
    redisClient.on('error', (err) => console.log('Redis Client Error', err))

    await redisClient.connect()
})()

async function setItem(key, val, expires) {
    await redisClient.set(key, val)
    if (expires) {
        await redisClient.expire(key, expires)
    }
    return null
}

async function getItem(key) {
    return redisClient.v4.get(key)
}

async function setHash(key, field, val) {
    return redisClient.hSet(key, field, val)
}

async function getHash(key, field) {
    return await redisClient.hGet(key, field)
}

async function getAllKeys() {
    return await redisClient.v4.keys('*')
}

module.exports = {
    setItem,
    getItem,
    setHash,
    getHash,
    getAllKeys
}
