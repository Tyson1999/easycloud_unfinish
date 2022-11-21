// API文档：https://keep2share.github.io/api/#resources:/getFilesInfo:post
const fs = require('fs')
const Path = require('path')

const axios = require('axios')
const FormData = require('form-data')

const Policy = require('../../model/Policy')
const policyService = require('../policy')
const policyTypeService = require('../policy_type')

class K2s extends Policy {
    constructor(policyId) {
        super(policyId)
    }

    async init() {
        const accessKey = await getAccessKey(this.policyId)
        this.uploadForm = await getUploadForm(accessKey)
    }

    /**
     * 将文件上传到k2s
     * @param file_obj
     * @returns
     */
    async uploadFile(file_obj) {
        let upload_form = this.uploadForm
        const fileId = file_obj['id']
        const file_path = file_obj['file_path']
        // 成功对接k2s，上传文件
        if (upload_form && upload_form['data']) {
            upload_form = upload_form['data']
            const form_action = upload_form['form_action']
            const ajax = upload_form['form_data']['ajax']
            const signature = upload_form['form_data']['signature']
            const params = upload_form['form_data']['params']
            const FileField = upload_form['file_field']

            const data = new FormData()
            data.append(`${FileField}`, fs.readFileSync(file_path), Path.basename(file_path))
            data.append('ajax', ajax.toString())
            data.append('signature', signature)
            data.append('params', params)
            // data.append(`file`, fs.createReadStream(file_path))

            const content_length = data.getLengthSync()
            await this.setUploadStatus(fileId, 0)
            const res = await axios.post(form_action, data, {
                headers: {
                    'Content-Length': content_length,
                    ...data.getHeaders()
                },
                maxBodyLength: Infinity
            })
            // 可能不需要
            if (res['status'] !== 200) {
                throw new Error(res['statusText'])
            } else {
                const {status_code, success, user_file_id, message} = res['data']
                if (success) {
                    await this.setUploadStatus(fileId, 1)
                    const item = {}
                    item['id'] = user_file_id
                    return item
                } else {
                    throw new Error(message || `上传失败，code: ${status_code}`)
                }
            }
        }
    }
}

async function getAccessKey(policyId) {
    const policy = await policyService.findOneBy({id: policyId})
    return policy['access_token']
}

async function getUploadForm(accessKey) {
    const {endpoint} = await policyTypeService.getPolicyTypeByType('k2s')
    const url = endpoint + '/getUploadFormData'
    return axios.post(url, {access_token: accessKey})
}


module.exports = K2s
