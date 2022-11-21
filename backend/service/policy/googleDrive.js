// https://www.section.io/engineering-education/google-drive-api-nodejs/
const fs = require('fs')

const {google} = require('googleapis')

const policyService = require('../policy')
const policyTypeService = require('../policy_type')
const Policy = require('../../model/Policy')
const {OAUTH_REDIRECT_URL} = require('../../utils/constant')


let DEFAULT_CLIENT_ID = ''
let DEFAULT_CLIENT_SECRET = ''

;(async function () {
    const policyDetail = await policyTypeService.findOneBy({type: 'googleDrive'})
    DEFAULT_CLIENT_ID = policyDetail['bucket_name']
    DEFAULT_CLIENT_SECRET = policyDetail['secret_key']
})()

class GoogleDrive extends Policy {
    constructor(policyId) {
        super(policyId)
    }

    static genTokenFlowUrl() {
        const SCOPES = ['https://www.googleapis.com/auth/drive']
        const oauth2Client = getOauth2Client()
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: SCOPES
        })
    }

    static async redeemToken(code) {
        const oauth2Client = getOauth2Client()
        const res = await oauth2Client.getToken(code)
        return res['tokens']
    }

    async init() {
        await super.init()
        // 获得已授权的Driver
        this.drive = getDriver({
            CLIENT_ID: DEFAULT_CLIENT_ID,
            CLIENT_SECRET: DEFAULT_CLIENT_SECRET,
            REFRESH_TOKEN: this.refreshToken
        })
        this.root_folder = await getRootFolder(this.policyId)
    }

    async uploadFile(fileObj) {
        const fileId = fileObj['id']
        const filename = fileObj['file_name']
        const fileSize = fileObj['file_size']
        const filePath = fileObj['file_path']
        // is asynchronous with the event emitter style and does not throw exceptions (which only make sense for synchronous code).
        const readableStream = fs.createReadStream(filePath)
        // Instead it will emit an error event.
        // readableStream.on('error', (err) => {})

        await this.setUploadStatus(fileId, 0)

        const response = await this.drive.files.create({
            requestBody: {
                parents: [this.root_folder],
                name: filename
                // mimeType: 'image/png'
            },
            supportsAllDrives: true,
            media: {
                // mimeType: 'image/png',
                body: readableStream
            }
        }, {
            onUploadProgress: (e) => {
                // process.stdout.clearLine()
                // process.stdout.cursorTo(0)
                // process.stdout.write(e.bytesRead.toString())
                const progress = e.bytesRead.toString() / fileSize
                this.setUploadStatus(fileId, progress)
            }
        })
        const item = {id: response.data['id']}
        return item
    }

    async getDownloadLink(fileId) {
        try {
            //change file permission to public.
            await this.drive.permissions.create({
                fileId,
                supportsAllDrives: true,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })

            //obtain the webview and webcontent links
            const result = await this.drive.files.get({
                fileId,
                supportsAllDrives: true,
                fields: 'webViewLink, webContentLink'
            })
            console.log(result.data)
        } catch (error) {
            console.log(error.message)
        }
    }
}

function getDriver(gdParams) {
    const {CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN} = gdParams
    // for test use
    // const OAUTH_REDIRECT_URL = 'https://developers.google.com/oauthplayground'
    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        OAUTH_REDIRECT_URL
    )
    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    })

    return drive
}

async function getRootFolder(policyId) {
    const {root_folder} = await policyService.findOneBy({id: policyId})
    return root_folder
}

function getOauth2Client() {
    const oauth2Client = new google.auth.OAuth2(
        DEFAULT_CLIENT_ID,
        DEFAULT_CLIENT_SECRET,
        OAUTH_REDIRECT_URL
    )
    return oauth2Client
}

module.exports = GoogleDrive
