const baseDao = require('./baseDao')
const model = require('../model')

class PolicyTypeDao extends baseDao {

}

const policyTypeDao = new PolicyTypeDao(model['PolicyType'])

module.exports = policyTypeDao
