const policyTypeDao = require('../model/Dao/policyTypeDao')

function getPolicyTypeByType(policyType) {
    return policyTypeDao.findOne({
        where: {type: policyType}
    })
}

function findAll() {
    return policyTypeDao.findAll()
}

function findOneBy(condition) {
    return policyTypeDao.findOneBy(condition)
}


module.exports = {
    getPolicyTypeByType,
    findAll,
    findOneBy
}
