// https://theluyuan.com/2021/04/%E9%80%9A%E8%BF%87nodejs%E6%8E%A5%E5%85%A5%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E5%AE%9E%E7%8E%B0%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6.html
// https://pan.baidu.com/union
const fs = require('fs')

const qs = require('qs')
const axios = require('axios')
const crypto = require('crypto')

const Policy = require('../../model/Policy')
const policyTypeService = require('../policy_type')
const {OAUTH_REDIRECT_URL} = require('../../utils/constant')

let DEFAULT_CLIENT_ID = ''
let DEFAULT_CLIENT_SECRET = ''

;(async function () {
    const policyDetail = await policyTypeService.findOneBy({type: 'baiduPan'})
    DEFAULT_CLIENT_ID = policyDetail['bucket_name']
    DEFAULT_CLIENT_SECRET = policyDetail['secret_key']
})()

// 普通会员分片最大为4M
const chunkSize = 4 * 1024 * 1024

class BaiduPan extends Policy {
    md5List = []
    remotePath = ''
    uploadid = null
    blockLength = 0

    constructor(policyId) {
        super(policyId)
    }

    static genTokenFlowUrl() {
        const scope = 'basic,netdisk'
        return 'https://openapi.baidu.com/oauth/2.0/authorize?' +
            'response_type=code&' +
            `client_id=${DEFAULT_CLIENT_ID}&` +
            `redirect_uri=${OAUTH_REDIRECT_URL}&` +
            `scope=${scope}&` +
            'display=popup'
    }

    static async redeemToken(code) {
        const tokenUrl = 'https://openapi.baidu.com/oauth/2.0/token'
        let res = await axios.get(tokenUrl, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: DEFAULT_CLIENT_ID,
                client_secret: DEFAULT_CLIENT_SECRET,
                redirect_uri: OAUTH_REDIRECT_URL
            }
        })
        res = res['data']
        // access_token refresh_token expires_in
        return res
    }

    async init() {
        await super.init()
        if (!this.accessToken) {
            const {access_token, expires_in, refresh_token} = await getAccessToken({
                client_id: DEFAULT_CLIENT_ID,
                client_secret: DEFAULT_CLIENT_SECRET,
                refresh_token: this.refreshToken
            })
            this.accessToken = access_token
            await this.setNewTokens({access_token, expires_in, refresh_token})
        }
    }

    async uploadFile(fileObj) {
        const fileId = fileObj['id']
        const fileSize = fileObj['file_size']
        await this.setUploadStatus(fileId, 0)

        await this.preCreate(fileObj)
        await this.uploadSlices(fileObj)
        await this.createFile(fileSize)
        return {} // 无value入库
    }

    async preCreate(fileObj) {
        const filename = fileObj['file_name']
        const filePath = fileObj['file_path']
        const fileSize = fileObj['file_size']
        const preCreateUrl = `https://pan.baidu.com/rest/2.0/xpan/file`
        const chuckNum = Math.ceil(fileSize / chunkSize)

        this.md5List = await getMd5List(filePath, chuckNum)
        this.remotePath = `/upload/${filename}`

        const params = {
            method: 'precreate',
            access_token: this.accessToken
        }
        const body = {
            path: this.remotePath,
            size: fileSize,
            isdir: 0,
            autoinit: 1,
            block_list: JSON.stringify(this.md5List),
            rtype: 1
        }

        const bodyStr = qs.stringify(body)

        let res = await axios.post(preCreateUrl, bodyStr, {
            params
        })
        res = res['data']
        const {uploadid, block_list, errno} = res
        if (errno !== 0) {
            throw new Error(`errno: ${errno}, 请联系管理员处理`)
        }
        this.uploadid = uploadid
        // block_list为空时，等价于[0]
        this.blockLength = block_list.length === 0 ? 1 : block_list.length
    }

    async uploadSlices(fileObj) {
        const fileId = fileObj['id']
        const filePath = fileObj['file_path']
        const fileSize = fileObj['file_size']
        const uploadUrl = `https://d.pcs.baidu.com/rest/2.0/pcs/superfile2`
        const params = {
            method: 'upload',
            access_token: this.accessToken,
            type: 'tmpfile',
            uploadid: this.uploadid,
            path: this.remotePath
        }

        let progress = 0
        for (let partseq = 0; partseq < this.blockLength; partseq++) {
            const slice = await getFileChuck(filePath, partseq)
            progress += slice.length / fileSize
            params['partseq'] = partseq
            try {
                const res = await axios.put(uploadUrl, slice, {
                    params
                })
                const {errno} = res['data']
                if (errno && errno !== 0) {
                    console.log(errno)
                } else {
                    await this.setUploadStatus(fileId, progress)
                }
            } catch (e) {
                console.log(e['response']['data'])
            }
        }
    }

    async createFile(fileSize) {
        const uploadUrl = `https://pan.baidu.com/rest/2.0/xpan/file`
        const params = {
            method: 'create',
            access_token: this.accessToken
        }
        const body = {
            isdir: 0,
            uploadid: this.uploadid,
            size: fileSize,
            path: this.remotePath,
            block_list: JSON.stringify(this.md5List)
        }
        const bodyStr = qs.stringify(body)
        const res = await axios.post(uploadUrl, bodyStr, {
            params,
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        const {errno} = res['data']
        if (errno !== 0) {
            throw new Error(`errno: ${errno}, 请联系管理员处理`)
        }
    }

    async getDownloadLink(itemId) {

    }
}

async function getMd5List(filePath, chuckSize) {
    const md5List = []
    for (let i = 0; i < chuckSize; i++) {
        let data = await getFileChuck(filePath, i)
        const hash = crypto.createHash('md5')
        hash.update(data)
        const md5 = hash.digest('hex')
        md5List.push(md5)
    }
    return md5List
}

function getFileChuck(filePath, i) {
    return new Promise((resolve) => {
        let data = ''
        let start = i * chunkSize
        let end = (i + 1) * chunkSize - 1
        const stream = fs.createReadStream(filePath, {
            start,
            end
        })
        stream.on('data', (chunk) => {
            // console.log(`接收到 ${chunk.length} 个字节的数据`);
            if (!data) {
                data = chunk
            } else {
                data = Buffer.concat([data, chunk])
            }
        })
        stream.on('end', () => {
            resolve(data)
        })
    })
}

async function getAccessToken(baiduParams) {
    const tokenURL = 'https://openapi.baidu.com/oauth/2.0/token'
    const {client_id, client_secret, refresh_token} = baiduParams
    const params = {
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token'
    }
    let res = await axios.get(tokenURL, {
        params
    })
    res = res['data']
    const model = {}
    model['access_token'] = res['access_token']
    model['expires_in'] = res['expires_in']
    model['refresh_token'] = res['refresh_token']
    return model
}

module.exports = BaiduPan
