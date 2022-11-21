const {fn} = require('sequelize')
const baseDao = require('./baseDao')
const model = require('../model')

class FileAttrsDao extends baseDao {
    getFileStatusByUserId(userId) {
        const options = {}
        options['include'] = [{
            model: model['File'],
            where: {user_id: userId},
            attributes: []
        }]
        options['attributes'] = [['status', 'label'], [fn('COUNT', '*'), 'count']]
        options['group'] = 'status'
        return this.findAll(options)
    }

}

const fileAttrsDao = new FileAttrsDao(model['FileAttrs'])

module.exports = fileAttrsDao
