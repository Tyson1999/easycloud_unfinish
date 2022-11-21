const {Op} = require('sequelize')
const baseDao = require('./baseDao')
const model = require('../model')

class PolicyDao extends baseDao {
    async joinWithPolicyTypeWithPolicyIdList(IdLst) {
        const options = {}
        options['include'] = [{
            model: model['PolicyType'],
            attributes: ['type', 'is_aggregation']
        }]
        const where = {}
        where['id'] = {[Op.in]: IdLst}
        return this.joinWithPolicyType({}, where)
    }

    async joinWithPolicyType(options = {}, where) {
        if (!options['include']) {
            options['include'] = [{
                model: model['PolicyType'],
                attributes: ['type', 'is_aggregation']
            }]
        }
        options['where'] = where
        return this.findAll(options)
    }

    async joinWithPolicyTypeAndUser(options = {}, where) {
        options['include'] = [{
            model: model['PolicyType'],
            attributes: ['type']
        }, {
            model: model['User'],
            attributes: ['username']
        }]
        options['where'] = where
        const res = await this.findAll(options)
        res.forEach(item => {
            item['type'] = item['policy_type.type']
            item['owner'] = item['user.username']
            delete item['policy_type.type']
            delete item['user.username']
        })
        return res
    }

    checkDuplicate(id, name) {
        const where = {}
        if (id) {
            where['id'] = {[Op.not]: id}
        }
        where['name'] = name
        return this.findOne({where})
    }

    updateSpaceUsed(num, where) {
        return this.model.increment({
            'space_used': num
        }, {where})
    }

    getAvailablePolicy(userId) {
        const options = {
            where: {
                [Op.or]: [{
                    [Op.and]: [{user_id: userId}, {is_active: 1}]
                }, {
                    [Op.and]: [{is_active: 1}, {is_system_policy: 1}]
                }]
            }
        }
        return this.joinWith(
            'PolicyType',
            {attributes: ['type']},
            options
        )
    }
}

const policyDao = new PolicyDao(model['Policy'])

module.exports = policyDao
