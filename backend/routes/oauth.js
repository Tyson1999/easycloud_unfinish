const router = require('koa-router')()
const Result = require('../model/Result')
const {genTokenFlowUrl, redeemToken} = require('../service/oauth')

router.prefix('/oauth')

// https://marvinsblog.net/post/2020-04-18-onedrive-rest-api-docs-notes-01/
router.get('/authorize', async (ctx) => {
    const {type} = ctx.query
    const tokenFlowUrl = await genTokenFlowUrl(type)
    if (tokenFlowUrl) {
        new Result(tokenFlowUrl, 'Redirect url generate success.').success(ctx)
    } else {
        new Result('You don\'t need authorize this policy!').fail(ctx)
    }
})

router.post('/redeem', async (ctx) => {
    const {token, policyId} = ctx.request.body
    await redeemToken(policyId, token)
    new Result('Authorize success.').success(ctx)
})

module.exports = router
