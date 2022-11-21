const router = require('koa-router')()
const uploadedRouter = require('./uploaded')
const Result = require('../../model/Result')
const File = require('../../model/File')
const work = require('../../service/work')
const {decoded} = require('../../utils')
const {getFileCategory} = require('../../service/file')

router.prefix('/file')

router.use(uploadedRouter.routes(), uploadedRouter.allowedMethods())

/**
 * 列出用户FTP文件夹中的文件
 */
router.get('/FTP', async (ctx) => {
    const {username, userId} = decoded(ctx.headers['authorization'], ctx)
    try {
        const files_arr = File.getLocalFiles(username, userId)
        new Result(files_arr, '获取库内文件列表成功').success(ctx)
    } catch (e) {
        new Result(e.message, '获取库内文件列表失败').fail(ctx)
        await ctx.MysqlLogger.error(userId, `获取库内文件列表失败，原因：${e.message}`)
    }
})

router.post('/FTP/upload', async (ctx) => {
    const {username, userId} = decoded(ctx.headers['authorization'], ctx)
    if (username) {
        try {
            const filesArr = File.getLocalFiles(username, userId)
            if (filesArr.length === 0) {
                new Result('库内无文件，请确保上传的文件符合规定扩展名。').fail(ctx)
            } else {
                for (const fileObj of filesArr) {
                    work.upload(fileObj)
                }
                new Result('提交成功，该操作为异步操作，请勿重复点击！').success(ctx)
            }
        } catch (e) {
            new Result(e.message, '操作失败').fail(ctx)
        }
    }
})


router.get('/category', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const category = await getFileCategory(userId)
        new Result(category, '获取category list成功').success(ctx)
    }
})


module.exports = router
