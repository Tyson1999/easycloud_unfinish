const moment = require('moment')

const {setItem} = require('../utils/redis')
const {updatePolicyById} = require('../service/policy')
const policyService = require('../service/policy')

class Policy {
    /**
     *
     * @param policyId
     */
    constructor(policyId) {
        this.policyId = policyId
    }

    /**
     * 初始化每个策略独立的access token
     * @returns {Promise<void>}
     */
    async init() {
        const {
            name,
            access_token,
            refresh_token,
            access_token_expires_at
        } = await policyService.findOneBy({id: this.policyId})
        // 数据库内的access token已经过期
        if (new Date(access_token_expires_at).getTime() < Date.now()) {
            this.accessToken = null
        } else {
            this.accessToken = access_token
        }
        this.policyName = name
        this.refreshToken = refresh_token
    }

    async uploadFile(fileObj) {
    }

    async getDownloadLink(value) {
        return value
    }

    async setUploadStatus(fileId, progress) {
        progress = Number(progress).toFixed(2) * 100 // 转换为百分比
        const key = `uploadProgress:${fileId}:${this.policyName}`
        const expires = 60 * 60 // in secs
        await setItem(key, progress, expires)
    }

    async setNewTokens(tokenParams) {
        const {expires_in, access_token, refresh_token} = tokenParams
        const deviation = 600 * 1000 // 提前10分钟
        const expires_in_ms = expires_in * 1000 // 秒转为毫秒
        const access_token_expires_at = moment(Date.now() + expires_in_ms - deviation).format('YYYY-MM-DD HH:mm:ss')
        const model = {access_token_expires_at}
        model['access_token'] = access_token
        if (refresh_token) {
            model['refresh_token'] = refresh_token
        }
        await updatePolicyById(this.policyId, model)
    }

}

module.exports = Policy
