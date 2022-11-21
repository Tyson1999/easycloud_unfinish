const _ = require('lodash')
const fileAttrsService = require('./file_attrs')
const policyService = require('./policy')
const creatorDao = require('../model/Dao/creatorDao')

async function getDownloadParamsByFileId(fileId) {
    let fileAttrs = await fileAttrsService.getFileAttrsByFileId(fileId)
    const policyIdLst = _.map(fileAttrs, 'policy_id')
    fileAttrs = _.map(fileAttrs, o => _.pick(o, ['policy_id', 'id']))
    const policyAttrs = await policyService.joinWithPolicyTypeWithPolicyIdList(policyIdLst)

    const storageList = []
    for (let i = 0; i < fileAttrs.length; i++) {
        const policyId = fileAttrs[i]['policy_id']
        for (const policyAttr of policyAttrs) {
            if (policyAttr['id'] === policyId && policyAttr['is_aggregation'] === 1) {
                const fileAttr = fileAttrs[i]
                const storageObj = {}
                storageObj['name'] = policyAttr['name']
                storageObj['itemId'] = fileAttr['id']
                storageObj['policyType'] = policyAttr['type']
                storageList.push(storageObj)
                break
            }
        }
    }
    return storageList
}

async function getCreatorByFileId(fileId) {
    const res = await creatorDao.joinWith('File', {
        where: {id: fileId},
        attributes: []
    }, {attributes: {exclude: ['id', 'category']}})
    const item = res[0]
    // 没有设置作者信息
    if (!item) {
        return null
    } else {
        // creator name 为 null
        if (!item['creator_name']) {
            return null
        } else {
            Object.keys(item).forEach(key => {
                if (!item[key]) {
                    delete item[key]
                }
            })
            return item
        }
    }
}

/**
 * 返回下载直接链接
 * @param itemId
 * @returns {Promise<void>}
 */
async function getDownloadUrlByItemId(itemId) {
    const fileAttr = await fileAttrsService.getFileAttrById(itemId)
    const {value, policy_id} = fileAttr
    const policyAttr = (await policyService.joinWithPolicyType({
        id: policy_id
    }))[0]

    const policyType = policyAttr['type']
    switch (policyType) {
        case 'k2s':
            break
        case 'onedrive':
            break
        case 'googleDrive':
            break
        case 'baiduPan':
            break
        case 'mega':
            break
    }
    console.log(policyAttr)
}

module.exports = {
    getDownloadParamsByFileId,
    getCreatorByFileId,
    getDownloadUrlByItemId
}
