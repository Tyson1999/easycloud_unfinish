/**
 * https://segmentfault.com/a/1190000021223658
 */
const router = require('koa-router')()
const Result = require('../model/Result')
const {AESDecrypt} = require('../utils')

const {
    getDownloadParamsByFileId,
    getCreatorByFileId,
    getDownloadUrlByItemId
} = require('../service/download')

router.prefix('/download')

router.get('/:cipher', async (ctx) => {
    let fileId = AESDecrypt(ctx.params['cipher'])
    if (fileId) {
        fileId = Number(fileId)
        const result = {}
        // 该文件所在所有激活的策略
        result['storages'] = await getDownloadParamsByFileId(fileId)
        // 作者信息
        result['creatorInfo'] = await getCreatorByFileId(fileId)
        new Result(result, '获取成功！').success(ctx)
    } else {
        throw ctx.Boom.badRequest('Invalid parameters')
    }
})

router.get('/item/:itemId', async (ctx) => {
    const itemId = ctx.params['itemId']
    if (itemId) {
        getDownloadUrlByItemId(itemId)
    } else {
        throw ctx.Boom.badRequest('Invalid parameters')
    }
})


function getLocalDownloadUrl() {

}


router.get('/od/:itemId', async (ctx) => {
    const itemId = ctx.params['itemId']
    try {
        const res = await getDownloadLink(itemId)
        ctx.status = 302
        ctx.redirect(res['@microsoft.graph.downloadUrl'])
    } catch (e) {
        new Result(e['message']).fail(ctx)
    }

})

module.exports = router
