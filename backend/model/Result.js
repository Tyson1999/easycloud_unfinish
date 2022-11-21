const {
    CODE_ERROR,
    CODE_SUCCESS,
    CODE_TOKEN_EXPIRED
} = require('../utils/constant')

class Result {
    constructor(data, msg = '操作成功', options) {
        this.data = null
        if (arguments.length === 0) {
            this.msg = '操作成功'
        } else if (arguments.length === 1) {
            this.msg = data
        } else {
            this.data = data
            this.msg = msg
            if (options) {
                this.options = options
            }
        }
    }

    createResult() {
        if (!this.code) {
            this.code = CODE_SUCCESS
        }
        let base = {
            code: this.code,
            msg: this.msg
        }
        if (this.data) {
            base.data = this.data
        }
        if (this.options) {
            base = {...base, ...this.options}
        }
        return base
    }

    json(ctx, options) {
        ctx.body = this.createResult()
        if (options && options.status) {
            ctx.status = options.status
        }
    }

    success(ctx) {
        this.code = CODE_SUCCESS
        let options
        if (this.options) {
            options = this.options
        }
        this.json(ctx, options)
    }

    fail(ctx) {
        this.code = CODE_ERROR
        let options
        if (this.options) {
            options = this.options
        }
        this.json(ctx, options)
    }

    jwtError(ctx) {
        this.code = CODE_TOKEN_EXPIRED
        const options = {status: 401}
        this.json(ctx, options)
    }
}

module.exports = Result
