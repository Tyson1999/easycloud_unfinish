const fs = require('fs')

const mega = require('megajs')
const Policy = require('../../model/Policy')
const policyService = require('../policy')

class Mega extends Policy {
    constructor(policyId) {
        super(policyId)
    }

    async init() {
        await super.init()
        const {
            account_name,
            access_token
        } = await policyService.findOneBy({id: this.policyId})
        this.accountName = account_name
        this.accessToken = access_token
        this.storage = await getStorage(account_name, access_token)
    }

    uploadFile(fileObj) {
        return new Promise((resolve, reject) => {
            const fileId = fileObj['id']
            const fileName = fileObj['file_name']
            const filePath = fileObj['file_path']
            const fileSize = fileObj['file_size']
            let bytesRead = 0
            const stream = fs.createReadStream(filePath)
            stream.on('data', async (chunk) => {
                bytesRead += chunk.length
                const progress = bytesRead / fileSize
                await this.setUploadStatus(fileId, progress)
            })
            const options = {
                name: fileName,
                size: fileSize
            }
            this.storage.upload(options, stream, (error, uploadedFile) => {
                if (error) {
                    reject(error)
                } else {
                    // 获得分享链接
                    uploadedFile.link((err, url) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve({id: url})
                        }
                    })
                }
            })
        })
    }

    async getDownloadLink(itemId) {
    }
}

function getStorage(email, password) {
    return new Promise((resolve, reject) => {
        const storage = new mega.Storage({email, password}, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(storage)
            }
        })
    })
}

module.exports = Mega
