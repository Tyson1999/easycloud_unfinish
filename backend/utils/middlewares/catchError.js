const Result = require('../../model/Result')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        if (err.name && err.name === 'UnauthorizedError') {
            const {status = 401, message} = err
            new Result(null, 'Token验证失败', {
                error: status,
                errMsg: message
            }).jwtError(ctx)
        } else {
            const msg = err.message || '系统错误'
            const errMsg =
                // Boom
                (err.output && err.output.payload && err.output.payload.error) ||
                // Axios
                (err.response && err.response.data && err.response.data) ||
                // Default
                msg
            const statusCode =
                // Boom
                (err.output && err.output.payload && err.output.payload.statusCode) ||
                // Axios
                (err.response && err.response.status) ||
                // Default
                500
            new Result(null, msg, {
                status: statusCode,
                errMsg
            }).fail(ctx)
        }
        ctx.app.emit('error', err, ctx)
    }
}

module.exports = catchError
