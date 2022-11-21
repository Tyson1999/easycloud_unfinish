const {fn} = require('sequelize')
const baseDao = require('./baseDao')
const model = require('../model')

class FileDao extends baseDao {
    getFileCategoryByUserId(userId) {
        const options = {}
        options['where'] = {
            user_id: userId
        }
        options['attributes'] = [['category', 'label'], [fn('COUNT', '*'), 'count']]
        options['group'] = 'category'
        return this.findAll(options)
    }
}

const fileDao = new FileDao(model['File'])

module.exports = fileDao
