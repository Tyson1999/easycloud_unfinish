const router = require('koa-router')()
const Result = require('../model/Result')
const {getLogs} = require('../service/sys_logs')
const {decoded} = require('../utils/index')
const {isAdmin} = require('./admin')

router.prefix('/logs')

router.get('/user', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const adminId = await isAdmin(ctx)
        const query = ctx.query
        let logs
        if (adminId) {
            logs = await getLogs(userId, query, true)
        } else {
            logs = await getLogs(userId, query)
        }
        new Result(logs, '获取user logs成功').success(ctx)
    }
})

// router.get('/sys', async (ctx, next) => {
//     try {
//         await isAdmin(ctx)
//         const query = ctx.query
//         const logs = await getLogs('System', query)
//         new Result(logs, '获取system logs成功').success(ctx)
//     } catch (e) {
//         new Result(e['message']).fail(ctx)
//     }
// })

module.exports = router
