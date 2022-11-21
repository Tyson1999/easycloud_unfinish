const {formatTime, AESEncrypt} = require('../utils')
const {DOMAIN, K2sDomains} = require('../utils/constant')
const fileAttrsDao = require('../model/Dao/fileAttrsDao')
const policyService = require('./policy')


async function createFileAttrByPolicy(file_id, policyId) {
    const start_upload_time = formatTime(new Date())
    const finish_upload_time = '1970-01-01 08:00:00' // 代表还未上传
    const status = 'Preparing'
    const comment = 'Uploading'
    const model = {
        file_id,
        policy_id: policyId,
        start_upload_time,
        finish_upload_time,
        status,
        comment
    }
    return fileAttrsDao.insertOne(model)
}

function updateOneFileAttr(model, where) {
    return fileAttrsDao.updateOne(model, where)
}

const setUploadStatus = {
    /**
     *
     * @param policyId 策略的`name`
     * @param value 远端文件存储标识
     * @param fileId 本地文件ID
     * @param comment
     */
    success: (policyId, value, fileId, comment = 'Upload successfully') => {
        const status = 'Completed'
        const finish_upload_time = formatTime(new Date())
        const model = {value, finish_upload_time, status, comment}
        return updateOneFileAttr(model, {
            policy_id: policyId
        })
    },

    /**
     *
     * @param policyId 策略的`name`
     * @param fileId 本地文件ID
     * @param comment
     */
    fail: (policyId, fileId, comment = null) => {
        const status = 'Failed'
        const value = 'Error'
        const finish_upload_time = formatTime(new Date())
        const model = {value, finish_upload_time, status, comment}
        return updateOneFileAttr(model, {
            policy_id: policyId
        })
    }
}


/**
 * 获取单个file的所有分享链接
 * 数据结构：{50: {k2s:xxx, od: xxx, mega:xxx ...}, ...}
 * @param fileId
 * @returns {Promise<{}>}
 */
async function getShareLinks(fileId) {
    const fileAttrs = await getFileAttrsByFileId(fileId)
    const res = {}
    res['Aggregation'] = {}
    for (const row of fileAttrs) {
        const status = row['status']
        const policy = (await policyService.joinWithPolicyType({id: row['policy_id']}))[0]
        // 非聚合，获取真实链接
        if (!Boolean(policy['is_aggregation'])) {
            const policyName = policy['name']
            const policyType = policy['type']
            const fileValue = row['value']
            const downloadLink = getDownloadLinkByPolicyType(policyType, fileValue)
            if (!res[policyName]) {
                res[policyName] = {}
            }
            res[policyName]['status'] = status
            res[policyName]['downloadLink'] = downloadLink
        }
    }
    res['Aggregation']['downloadLink'] = getAggregationDownloadLink(fileId)
    return res
}

/**
 * 生成非聚合策略的直链
 * @param type
 * @param policyValue
 * @returns {{}}
 */
function getDownloadLinkByPolicyType(type, policyValue) {
    switch (type) {
        case 'k2s':
            const result = {}
            for (const domain of K2sDomains) {
                result[domain] = `https://${domain}/file/${policyValue}`
            }
            return result
    }
}

function getAggregationDownloadLink(fileId) {
    return `${DOMAIN}/download/${AESEncrypt(fileId)}`
}

function getFileAttrsByFileId(file_id) {
    return fileAttrsDao.findAll({
        where: {file_id}
    })
}

function getFileAttrById(id) {
    return fileAttrsDao.findOne({
        where: {id}
    })
}

function deleteFileAttrById(id) {
    return fileAttrsDao.deleteOne({id})
}


async function getFileAttrs(fileIdArray) {
    const fileAttrsData = {}

    const fileAttrs = await fileAttrsDao.findAll({
        where: {file_id: fileIdArray}
    })
    for (const fileAttr of fileAttrs) {
        const fileId = fileAttr['file_id']
        const currentPolicy = await policyService.findOneBy({id: fileAttr['policy_id']})
        const currentPolicyName = currentPolicy['name']
        const currentStartUploadTime = fileAttr['start_upload_time']
        const currentFinishUploadTime = fileAttr['finish_upload_time']
        const currentDownloadLink = fileAttr['value']
        let currentStatus = fileAttr['status']
        const currentComment = fileAttr['comment']
        // 检查policy是否active
        if (currentPolicy['is_active'] === 0) {
            currentStatus = 'Inactive'
        }
        if (!fileAttrsData[fileId]) {
            fileAttrsData[fileId] = {}
            fileAttrsData[fileId]['start_upload_time'] = {}
            fileAttrsData[fileId]['finish_upload_time'] = {}
            fileAttrsData[fileId]['download_link'] = {}
            fileAttrsData[fileId]['status'] = {}
            fileAttrsData[fileId]['comment'] = {}
        }
        fileAttrsData[fileId]['start_upload_time'][currentPolicyName] = currentStartUploadTime
        fileAttrsData[fileId]['finish_upload_time'][currentPolicyName] = currentFinishUploadTime
        fileAttrsData[fileId]['download_link'][currentPolicyName] = currentDownloadLink
        fileAttrsData[fileId]['status'][currentPolicyName] = currentStatus
        fileAttrsData[fileId]['comment'][currentPolicyName] = currentComment
    }
    return fileAttrsData
}

function getFileStatus(userId) {
    return fileAttrsDao.getFileStatusByUserId(userId)
}

module.exports = {
    getFileAttrById,
    getShareLinks,
    createFileAttrByPolicy,
    setUploadStatus,
    getFileAttrsByFileId,
    deleteFileAttrById,
    getFileAttrs,
    getFileStatus
}
