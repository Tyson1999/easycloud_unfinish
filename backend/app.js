const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
// https://github.com/lin-xin/blog/issues/28
const koajwt = require('koa-jwt')
const Boom = require('boom')

const path = require('path')
const staticPath = './static'
app.use(static(path.join(__dirname, staticPath)))

// routers 如何优雅引入
// http://www.shanhuxueyuan.com/news/detail/129.html
// https://www.cnblogs.com/shenshangzz/p/9973397.html
const user = require('./routes/user')
const file = require('./routes/file')
const download = require('./routes/download')
const policies = require('./routes/policy')
const settings = require('./routes/settings')
const logs = require('./routes/logs')
const creator = require('./routes/creator')
const oauth = require('./routes/oauth')

//admin routers
const users = require('./routes/admin/users')

// customize error handler
const catchError = require('./utils/middlewares/catchError')
app.use(catchError)

app.use(async (ctx, next) => {
    ctx.Boom = Boom
    await next()
})

// middlewares
app.use(cors({
    credentials: true
}))
const {JWT_PRIVATE_KEY} = require('./utils/constant')
app.use(koajwt({
    secret: JWT_PRIVATE_KEY
}).unless({
    // '/'这个是定界符，是判断正则表达式从哪里开始到哪里结束
    path: [
        '/user/login',
        '/settings/checkFileStatus',
        /^\/download\/*/,
        '/settings/'
    ]
}))
app.use(json())
app.use(logger())
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))

const MysqlLogger = require('./utils/MysqlLogger')
app.use(async (ctx, next) => {
    ctx.MysqlLogger = MysqlLogger
    await next()
})

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(user.routes(), user.allowedMethods())
app.use(file.routes(), file.allowedMethods())
app.use(download.routes(), download.allowedMethods())
app.use(policies.routes(), policies.allowedMethods())
app.use(settings.routes(), settings.allowedMethods())
app.use(logs.routes(), logs.allowedMethods())
app.use(creator.routes(), creator.allowedMethods())
app.use(oauth.routes(), oauth.allowedMethods())

// admin routers
app.use(users.routes(), users.allowedMethods())

// error event handling
app.on('error', (err, ctx) => {
    console.log(err)
})

// 可以捕获所有eventEmitter发出错误
process.on('uncaughtException', function (err) {
    console.log('UNCAUGHT EXCEPTION - keeping process alive:', err) // err.message is "foobar"
})

module.exports = app
