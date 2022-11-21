const {Op} = require('sequelize')
const baseDao = require('./baseDao')
const model = require('../model')

class CreatorDao extends baseDao {
    getCreatorByNameLike(creatorName, option = {}) {
        if (creatorName) {
            option['where'] = {}
            option['where']['creator_name'] = {
                [Op.like]: `%${creatorName}%`
            }
        }
        return this.findAll(option)
    }
}

const creatorDao = new CreatorDao(model['Creator'])

module.exports = creatorDao
