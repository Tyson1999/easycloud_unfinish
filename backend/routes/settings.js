const router = require('koa-router')()
const {SESSION_KEY} = require('../utils/constant')
const {checkAbnormalFiles, getSystemSettings} = require('../service/settings')
const Result = require('../model/Result')

router.prefix('/settings')

/**
 * 获取系统常量，不需要鉴权
 */
router.get('/', async (ctx) => {
    const settingsObj = await getSystemSettings()
    new Result(settingsObj, '获取系统设置成功！').success(ctx)
})

/**
 * 外部定期调用，用于检查文件上传异常、失效等问题。
 */
router.get('/checkFileStatus', async (ctx, next) => {
    const {session_key, file_id} = ctx.query
    if (session_key !== SESSION_KEY) {
        new Result('获取失败').fail(ctx)
        return
    }
    let ids
    if (file_id)
        ids = [file_id]
    await checkAbnormalFiles()
    new Result().success(ctx)
})

module.exports = router
