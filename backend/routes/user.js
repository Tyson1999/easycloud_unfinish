const router = require('koa-router')()
const {getUserByUsernameAndPassword, getUserById} = require('../service/user')
const Result = require('../model/Result')
const {decoded} = require('../utils/index')
const jwt = require('jsonwebtoken')
const {JWT_EXPIRED, JWT_PRIVATE_KEY} = require('../utils/constant')
const {initUserFTPFolders, initUserStoreFolders} = require('../service/file')

router.prefix('/user')

router.post('/login', async (ctx) => {
    let {username, password} = ctx.request.body
    try {
        const res = await getUserByUsernameAndPassword(username, password)
        if (res && res.length !== 0) {
            const userId = res['id']
            const token = jwt.sign({userId, username}, JWT_PRIVATE_KEY, {expiresIn: JWT_EXPIRED}) //生成jwt
            // 生成用户文件夹
            initUserFTPFolders({userId, username})
            initUserStoreFolders({userId, username})
            new Result({token}, '登录成功').success(ctx)
            await ctx.MysqlLogger.info(userId, '登录成功')
        } else {
            new Result('登录失败，账号或密码错误').fail(ctx)
        }
    } catch (err) {
        new Result(err.message, '系统错误').fail(ctx)
    }
})


router.get('/info', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const user = await getUserById(userId)
        if (user) {
            user.roles = [user.roles]
            new Result(user, '用户信息查询成功').success(ctx)
        } else
            new Result('用户信息查询失败').fail(ctx)
    }
})


module.exports = router
