const fs = require('fs')

const crypto = require('crypto')
const cryptoJS = require('crypto-js')
const SHA2 = require('crypto-js/sha256')
const AES = require('crypto-js/AES')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const {JWT_PRIVATE_KEY, SALT, AES_KEY} = require('./constant')
const Result = require('../model/Result')

function getSHA2(val) {
    return SHA2(val + SALT).toString()
}

// https://www.jianshu.com/p/a47477e8126a
// https://juejin.cn/post/6844903695709110286
// https://stackoverflow.com/questions/61046037/cryptojs-aes-encryption-with-ecb-mode-produces-different-results-with-the-same-p
function AESEncrypt(val) {
    const key = cryptoJS.enc.Utf8.parse(AES_KEY)
    const encContent = AES.encrypt(val, key, {mode: cryptoJS.mode.ECB})
    return cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(encContent))
}

function AESDecrypt(val) {
    const key = cryptoJS.enc.Utf8.parse(AES_KEY)
    const decContent = cryptoJS.enc.Base64.parse(val).toString(cryptoJS.enc.Utf8)
    return AES.decrypt(decContent, key, {mode: cryptoJS.mode.ECB}).toString(cryptoJS.enc.Utf8)
}


function getFileMd5Async(file_path) {
    return new Promise(((resolve, reject) => {
        const stream = fs.createReadStream(file_path)
        const hash = crypto.createHash('md5')
        stream.on('data', chunk => {
            hash.update(chunk, 'utf8')
            // console.log(chunk)
        })
        stream.on('end', () => {
            const md5 = hash.digest('hex')
            // console.log(md5)
            resolve(md5)
        })
    }))
}

function decoded(token) {
    if (token.indexOf('Bearer') === 0) {
        token = token.replace('Bearer ', '')
    }
    return jwt.verify(token, JWT_PRIVATE_KEY)
}

function formatTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {
    getSHA2,
    AESEncrypt,
    AESDecrypt,
    decoded,
    formatTime,
    getFileMd5Async
}
