const fs = require('fs')

const File = require('../model/File')
const {
    initFileUpload,
    createFileRecord,
    getFileByHash,
    deleteFileRecord,
    deleteOneFile,
    updateOneFile
} = require('./file')
const {createFileAttrByPolicy, getFileAttrsByFileId, deleteFileAttrById} = require('./file_attrs')
const {getFileMd5Async} = require('../utils')
const {initOnePolicyInstance} = require('../utils/policy')
const MysqlLogger = require('../utils/MysqlLogger')
const {setUploadStatus} = require('./file_attrs')

const policyService = require('./policy')

const K2s = require('./policy/k2s')
const Onedrive = require('./policy/onedrive')
const Mega = require('./policy/mega')
const GoogleDrive = require('./policy/googleDrive')
const BaiduPan = require('./policy/baiduPan')

async function upload(fileObj) {
    fileObj = new File().fromObject(fileObj)
    const userId = fileObj['user_id']
    const activePolicies = await policyService.getAvailablePolicyByUserId(userId)
    checkDuplicateFile(fileObj).then(fileObj => {
        if (fileObj['file_hash']) {
            for (const policy of activePolicies) {
                uploadToPolicy(policy, fileObj)
            }
        }
    })
}

async function reUpload(fileId, checkedPolicies) {
    const fileAttrs = await getFileAttrsByFileId(fileId)
    const fileObj = await (new File().fromDB(fileId))
    const userId = fileObj['user_id']

    for (const {policyId} of checkedPolicies) {
        // 查看policy是否存在，且激活
        const policy = (await policyService.joinWithPolicyType({id: policyId}))[0]
        if (policy && policy['is_active'] === 1) {
            // 找到对应已有记录（相同policy ID的），并删除记录
            for (const fileAttr of fileAttrs) {
                if (parseInt(fileAttr['policy_id']) === policyId) {
                    await deleteFileAttrById(fileAttr['id'])
                }
            }
            await createFileAttrByPolicy(fileId, policyId)
            // 重新上传
            await uploadToPolicy(policy, fileObj)
        } else {
            await MysqlLogger.error(userId, 'policy参数错误')
        }
    }
}

async function uploadToPolicy(policy, fileObj) {
    const {id, name, type} = policy

    const policyId = id
    const policyName = name
    const policyType = type
    const fileId = fileObj['id']
    const userId = fileObj['user_id']
    const fileSize = fileObj['file_size']
    const filename = fileObj['file_name']
    const filePath = fileObj['file_path']

    function success(item) {
        policyService.updateSpaceUsed(fileSize, policyId)
        const comment = `文件 ${filename} 上传至 ${policyName} 成功！`
        MysqlLogger.info(userId, comment)
        setUploadStatus.success(policyId, item['id'], fileId)
    }

    function fail(err) {
        let errMsg = ''
        if (err['response'] && err['response']['data']) {
            Object.keys(err['response']['data']).forEach(key => {
                errMsg += err['response']['data'][key]
                errMsg += ' '
            })
        } else {
            errMsg = err['message']
        }
        const comment = `文件 ${filename} 上传至 ${policyName}(${policyType}) 失败，原因：${errMsg}`
        setUploadStatus.fail(policyId, fileId, errMsg)
        MysqlLogger.error(userId, comment)
    }

    try {
        if (!fs.existsSync(filePath)) {
            fail(new Error('File does not exist'))
            return
        }
        let policyInstance = await initOnePolicyInstance(policy)
        if (policyInstance) {
            const item = await policyInstance.uploadFile(fileObj)
            success(item)
        } else {
            fail(new Error('Unknown policy'))
        }
        policyInstance = null
    } catch (e) {
        fail(e)
    }
}


/**
 * 检测库中是否有重复文件
 * @param file_obj
 * @returns {Promise<*>}
 */
async function checkDuplicateFile(fileObj) {
    await initFileUpload(fileObj)
    const uploader = fileObj['uploader']
    const userId = fileObj['user_id']
    const file_name = fileObj['file_name']
    const category = fileObj['category'] || 'default'
    const file_path = fileObj['file_path']
    const file_size = fileObj['file_size']

    // 新建文件记录
    const file_relative_path = fileObj['file_relative_path']
    const random_hash = 'random' + Math.random().toFixed(6).slice(-6)
    const params = {
        file_name,
        // need fix
        display_name: file_name,
        user_id: userId,
        category,
        file_path: file_relative_path,
        file_size,
        file_hash: random_hash
    }
    const newRecord = await createFileRecord(params)

    // 计算文件是否重复
    const file_hash = await getFileMd5Async(file_path)
    const res = await getFileByHash(file_hash)
    const file_id = newRecord['id']
    // 重复
    if (res) {
        // 删除文件记录
        await deleteFileRecord(file_id)
        // 删除文件
        if (res['uploader'] !== uploader)
            deleteOneFile(file_path)
        await MysqlLogger.warning(userId, `文件 ${file_name} 重复，删除并跳过上传`)
    } else {
        // 增加属性
        fileObj['id'] = file_id
        fileObj['file_hash'] = file_hash
        // 更新文件记录hash
        await updateOneFile({file_hash}, file_id)
        // 增加file_attrs表N条记录
        const policies = await policyService.getAvailablePolicyByUserId(userId)
        for (const policy of policies) {
            await createFileAttrByPolicy(file_id, policy['id'])
        }
        await MysqlLogger.info(userId, `文件 ${file_name} 入库成功，等待上传。`)
    }
    return fileObj
}

module.exports = {
    upload,
    reUpload
}
