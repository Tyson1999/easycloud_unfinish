const router = require('koa-router')()

const {decoded} = require('../../utils')
const {listExistFiles, updateOneFile, getFileById, deleteOneFile, deleteFileRecord} = require('../../service/file')
const Result = require('../../model/Result')
const {getFileAttrs, getShareLinks, getFileStatus} = require('../../service/file_attrs')
const work = require('../../service/work')
const {STORE_ROOT_PATH} = require('../../utils/constant')


router.prefix('/uploaded')


/**
 * 从数据库中获取用户现有文件
 */
router.get('/', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const query = ctx.query
        const res = await listExistFiles(userId, query)
        new Result(res, '获取用户文件列表成功').success(ctx)
    }
})


/**
 * 更新文件信息
 */
router.put('/file/info', async (ctx) => {
    const {username} = decoded(ctx.headers['authorization'], ctx)
    if (username) {
        const {file_id, display_name, creator_id} = ctx.request.body['model']
        const model = {display_name, creator_id}
        await updateOneFile(model, file_id)
        new Result('更新成功！').success(ctx)
    }
})


/**
 * 根据传回的文件记录，找到并返回对应file attrs
 */
router.post('/file-attrs', async (ctx) => {
    const {username} = decoded(ctx.headers['authorization'], ctx)
    if (username) {
        const {file_ids} = ctx.request.body
        const res = await getFileAttrs(file_ids)
        new Result(res, '获取用户文件属性列表成功').success(ctx)
    }
})

// https://gitpress.io/@rainy/koa-post
router.post('/re-upload', async (ctx) => {
    const {username} = decoded(ctx.headers['authorization'], ctx)
    if (username) {
        const {file_id, checkedPolicies} = ctx.request.body
        // 如何解决？
        work.reUpload(file_id, checkedPolicies)
        new Result('提交成功，该操作为异步操作，请勿重复点击！').success(ctx)
    }
})

router.get('/share', async (ctx) => {
    const {username} = decoded(ctx.headers['authorization'], ctx)
    if (username) {
        const {file_id} = ctx.query
        const res = await getShareLinks(file_id)
        new Result(res, '获取文件分享链接成功').success(ctx)
    }
})

router.delete('/:fileId', async (ctx) => {
    const {username} = decoded(ctx.headers['authorization'], ctx)
    if (username) {
        const fileId = ctx.params.fileId
        const file = await getFileById(fileId)
        if (file['uploader'] !== username) {
            new Result('无权操作').fail(ctx)
        } else {
            try {
                await deleteOneFile(`${STORE_ROOT_PATH}/${file['file_path']}`)
            } catch (e) {
            }
            await deleteFileRecord(fileId)
            new Result('文件删除成功！').success(ctx)
        }
    }
})


router.get('/statusList', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const statusList = await getFileStatus(userId)
        new Result(statusList, '获取status list成功').success(ctx)
    }
})

module.exports = router
