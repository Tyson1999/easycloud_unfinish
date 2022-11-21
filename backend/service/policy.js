const policyDao = require('../model/Dao/policyDao')


function findOneBy(condition) {
    return policyDao.findOneBy(condition)
}

/**
 * 与policyType交集
 * @param where
 * @returns {Promise<*>} 含有policy.type与含有policy.is_aggregation
 */
async function joinWithPolicyType(where) {
    const res = await policyDao.joinWithPolicyType({}, where)
    res.forEach(item => {
        item['type'] = item['policy_type.type']
        item['is_aggregation'] = item['policy_type.is_aggregation']
        delete item['policy_type.type']
        delete item['policy_type.is_aggregation']
    })
    return res
}

async function joinWithPolicyTypeWithPolicyIdList(IdLst) {
    const res = await policyDao.joinWithPolicyTypeWithPolicyIdList(IdLst)
    res.forEach(item => {
        item['type'] = item['policy_type.type']
        item['is_aggregation'] = item['policy_type.is_aggregation']
        delete item['policy_type.type']
        delete item['policy_type.is_aggregation']
    })
    return res
}

/**
 * 获取所有可用策略
 * 包括用户对接与系统通用
 * @returns {Promise<*>}
 */
async function getAvailablePolicyByUserId(user_id) {
    const res = await policyDao.getAvailablePolicy(user_id)
    res.forEach(item => {
        item['type'] = item['policy_type.type']
        delete item['policy_type.type']
    })
    return res
}

function getPoliciesByUserId(userId, isAdmin) {
    let where
    if (!isAdmin) {
        where = {user_id: userId}
    }
    return policyDao.joinWithPolicyTypeAndUser({}, where)
}

async function updatePolicyById(id, model) {
    delete model['id']
    delete model['type']
    delete model['owner']
    delete model['access_token_expires_at']
    delete model['space_used']
    const {name} = model
    // 查看有没有同名策略
    let duplicate
    if (name) {
        duplicate = await policyDao.checkDuplicate(id, name)
    }
    if (duplicate) {
        throw new Error('已有同名策略，请更换策略名')
    } else {
        const where = {id}
        return policyDao.updateOne(model, where)
    }
}

async function addOnePolicy(model) {
    const {name} = model
    // 查看是否有同名策略
    const duplicate = await policyDao.checkDuplicate(null, name)
    if (duplicate)
        throw new Error('已有同名策略，请更换策略名')
    else {
        return policyDao.insertOne(model)
    }
}

async function updateSpaceUsed(num, policyId) {
    const where = {
        id: policyId
    }
    return policyDao.updateSpaceUsed(num, where)
}


module.exports = {
    joinWithPolicyTypeWithPolicyIdList,
    findOneBy,
    joinWithPolicyType,
    getAvailablePolicyByUserId,
    getPoliciesByUserId,
    updatePolicyById,
    addOnePolicy,
    updateSpaceUsed
}
