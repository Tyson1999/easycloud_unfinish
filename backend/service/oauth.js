const Onedrive = require('../service/policy/onedrive')
const GoogleDrive = require('../service/policy/googleDrive')
const BaiduPan = require('../service/policy/baiduPan')
const policyService = require('./policy')
const policyTypeService = require('./policy_type')

/**
 * 跳转用户到授权页面
 * @param policyType
 * @returns {Promise<string>}
 */
async function genTokenFlowUrl(policyType) {
    let tokenFlowUrl
    switch (policyType) {
        case 'onedrive':
            tokenFlowUrl = Onedrive.genTokenFlowUrl()
            break
        case 'googleDrive':
            tokenFlowUrl = GoogleDrive.genTokenFlowUrl()
            break
        case 'baiduPan' :
            tokenFlowUrl = BaiduPan.genTokenFlowUrl()
            break
    }
    return tokenFlowUrl
}


/**
 * 后台兑换Authorization code
 * @param policyId
 * @param code
 * @returns {Promise<void>}
 */
async function redeemToken(policyId, code) {
    const {policy_type_id} = await policyService.findOneBy({id: policyId})
    const policyType = (await policyTypeService.findOneBy({id: policy_type_id}))['type']
    let tokens
    switch (policyType) {
        case 'onedrive':
            tokens = await Onedrive.redeemToken(code)
            break
        case 'googleDrive':
            tokens = await GoogleDrive.redeemToken(code)
            break
        case 'baiduPan':
            tokens = await BaiduPan.redeemToken(code)
            break
    }
    if (tokens) {
        await setNewTokens(policyId, tokens)
    }
}

/**
 * 存储Access token 和 Refresh token
 * @param policyId
 * @param tokens
 * @returns {Promise<void>}
 */
async function setNewTokens(policyId, tokens) {
    // refresh token & access token
    const {access_token, refresh_token, expires_in} = tokens
    await policyService.updatePolicyById(policyId, {access_token, refresh_token})
}

module.exports = {
    redeemToken,
    genTokenFlowUrl
}
