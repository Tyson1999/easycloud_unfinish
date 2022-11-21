const router = require('koa-router')()
const Result = require('../../model/Result')
const {isAdmin} = require('./index')
const {getUsers, updateUser, addUser} = require('../../service/user')

router.prefix('/admin/users')


router.get('/', async (ctx) => {
    const adminId = await isAdmin(ctx)
    if (adminId) {
        const res = {}
        const users = await getUsers()
        res['tableData'] = users
        res['count'] = users.length
        new Result(res, '获取成功').success(ctx)
    } else {
        new Result('权限不足').fail(ctx)
    }
})

router.put('/', async (ctx) => {
    const adminId = await isAdmin(ctx)
    if (adminId) {
        const model = ctx.request.body
        await updateUser(model)
        new Result('更新成功').success(ctx)
    } else {
        new Result('权限不足').fail(ctx)
    }
})

router.post('/', async (ctx) => {
    const adminId = await isAdmin(ctx)
    if (adminId) {
        const model = ctx.request.body
        await addUser(model)
        new Result('新增成功').success(ctx)
    } else {
        new Result('权限不足').fail(ctx)
    }
})


module.exports = router
