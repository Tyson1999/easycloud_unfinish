const _ = require('lodash')
const router = require('koa-router')()
const Result = require('../model/Result')

const {decoded} = require('../utils/index')
const {getAvailablePolicyByUserId, addOnePolicy, updatePolicyById, getPoliciesByUserId} = require('../service/policy')
const PolicyTypeService = require('../service/policy_type')
const {isAdmin} = require('./admin')

router.prefix('/policy')

/**
 * 新建
 */
router.post('/', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    const model = ctx.request.body
    model['user_id'] = userId
    try {
        await addOnePolicy(model)
        new Result('增加成功').success(ctx)
    } catch (e) {
        new Result(e['message']).fail(ctx)
    }
})

/**
 * 更新一个策略
 */
router.put('/:policyId', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    const policyId = ctx.params['policyId']
    const model = ctx.request.body
    const policyBelongs = model['user_id']
    if (userId !== policyBelongs) {
        throw ctx.Boom.forbidden('No permission.')
    } else {
        await updatePolicyById(policyId, model)
        await ctx.MysqlLogger.info(userId, `修改policy：${policyId} 成功`)
        new Result('修改成功').success(ctx)
    }
})

/**
 * 根据用户ID, 获取所有激活的Policy
 */
router.get('/activePolicies', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    let activePolicies = await getAvailablePolicyByUserId(userId)
    const res = []
    activePolicies.forEach(row => {
        row = _.pick(row, ['id', 'name', 'type'])
        res.push(row)
    })
    new Result(res, '获取active policies成功').success(ctx)
})

/**
 * 根据用户ID, 列出存储策略
 * 管理员则列出所有存储策略
 */
router.get('/', async (ctx) => {
    const {userId} = decoded(ctx.headers['authorization'], ctx)
    const adminId = await isAdmin(ctx)
    const policies = await getPoliciesByUserId(userId, adminId)
    const result = {}
    result['tableData'] = policies
    result['count'] = policies.length
    new Result(result, '获取成功').success(ctx)
})


router.get('/type', async (ctx) => {
    const adminId = await isAdmin(ctx)
    const policyTypes = await PolicyTypeService.findAll()
    if (adminId) {
        new Result(policyTypes, '获取成功').success(ctx)
    } else {
        const res = []
        policyTypes.forEach(row => {
            if (row['permission'] === 'user') {
                row = _.pick(row, ['id', 'name', 'type'])
                res.push(row)
            }
        })
        new Result(res, '获取用户可用策略类别成功').success(ctx)
    }
})

module.exports = router
