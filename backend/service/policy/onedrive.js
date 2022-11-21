const fs = require('fs')

const oneDriveAPI = require('onedrive-api')
const axios = require('axios')
const qs = require('qs')

const Policy = require('../../model/Policy')
const policyTypeService = require('../policy_type')
const {OAUTH_REDIRECT_URL} = require('../../utils/constant')

let DEFAULT_CLIENT_ID = ''
let DEFAULT_CLIENT_SECRET = ''

// ; 不能省略 https://segmentfault.com/q/1010000011148571
;(async function () {
    const policyDetail = await policyTypeService.findOneBy({type: 'onedrive'})
    DEFAULT_CLIENT_ID = policyDetail['bucket_name']
    DEFAULT_CLIENT_SECRET = policyDetail['secret_key']
})()


class Onedrive extends Policy {
    constructor(policyId) {
        super(policyId)
    }

    // 生成TokenFlow的链接
    // scope: https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/concepts/permissions_reference?view=odsp-graph-online
    static genTokenFlowUrl() {
        const scope = 'offline_access Files.Read Files.Read.All'
        return 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' +
            `client_id=${DEFAULT_CLIENT_ID}&` +
            `scope=${scope}&` +
            'response_type=code&' +
            `redirect_uri=${OAUTH_REDIRECT_URL}`
    }

    // 兑换code 换取accessToken & refreshToken
    static async redeemToken(code) {
        const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        const grant_type = 'authorization_code'
        let res = await axios.post(tokenUrl, qs.stringify({
            client_id: DEFAULT_CLIENT_ID,
            client_secret: DEFAULT_CLIENT_SECRET,
            code,
            redirect_uri: OAUTH_REDIRECT_URL,
            grant_type
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        res = res['data']
        return res
    }

    async init() {
        await super.init()
        this.accessToken = await getAccessToken(this.refreshToken)
    }

    async uploadFile(fileObj) {
        const fileId = fileObj['id']
        const filename = fileObj['file_name']
        const filePath = fileObj['file_path']
        const fileSize = fileObj['file_size']
        const readableStream = fs.createReadStream(filePath)

        const item = await oneDriveAPI.items.uploadSession({
            accessToken: this.accessToken,
            filename,
            fileSize,
            readableStream,
            chunksToUpload: 200
        }, (bytesUploaded) => {
            const progress = bytesUploaded / fileSize
            this.setUploadStatus(fileId, progress)
        })
        return item
    }

    async getDownloadLink(itemId) {
        return oneDriveAPI.items.getMetadata({
            accessToken: this.accessToken,
            itemId
        })
    }
}

async function getAccessToken(refreshToken) {
    const tokenURL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    const params = {
        client_id: DEFAULT_CLIENT_ID,
        redirect_uri: OAUTH_REDIRECT_URL,
        client_secret: DEFAULT_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    }
    let res = await axios.post(tokenURL, qs.stringify(params), {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
    res = res['data']
    return `Bearer ${res['access_token']}`
}


module.exports = Onedrive
