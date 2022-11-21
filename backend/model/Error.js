// https://segmentfault.com/a/1190000023327434
class PolicyException extends Error {
    constructor(message, errorCode = 1000) {
        super()
        this.message = message
        this.code = errorCode
    }
}


module.exports = PolicyException
