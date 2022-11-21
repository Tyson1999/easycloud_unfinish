const router = require('koa-router')()

const Result = require('../model/Result')
const {decoded} = require('../utils')
const {
    getCreatorCategory,
    addOneCreator,
    checkDuplicateCreator,
    getCreatorsByName,
    editOneCreator
} = require('../service/creator')

router.prefix('/creator')

router.get('/category', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const category = await getCreatorCategory()
        new Result(category, '获取成功！').success(ctx)
    }
})

/**
 * 新增一个creator
 */
router.post('/', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const model = ctx.request.body
        const isDuplicate = await checkDuplicateCreator(model)
        if (isDuplicate) {
            new Result('新增失败，同名作者已存在！').fail(ctx)
        } else {
            await addOneCreator(model)
            new Result('新增成功！').success(ctx)
            await ctx.MysqlLogger.info(userId, `新增作者 ${model['creator_name']} 成功！`)
        }
    }
})

router.get('/', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const creatorName = ctx.query['creator_name']
        const res = await getCreatorsByName(creatorName)
        new Result(res, '获取成功！').success(ctx)
    }
})

/**
 * 更新一个作者信息
 */
router.put('/', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    if (userId) {
        const model = ctx.request.body
        const isDuplicate = await checkDuplicateCreator(model)
        if (isDuplicate) {
            new Result('更新失败，同名作者已存在！').fail(ctx)
        } else {
            await editOneCreator(model)
            new Result('更新成功！').success(ctx)
            await ctx.MysqlLogger.info(userId, `更新作者 ${model['creator_name']} 成功！`)
        }
    }
})

module.exports = router
