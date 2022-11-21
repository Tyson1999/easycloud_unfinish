const baseDao = require('./baseDao')
const model = require('../model')

class SysLogsDao extends baseDao {
    findAllWithUsername(options) {
        return this.joinWith('User', {attributes: ['username']}, options)
    }
}

const sysLogsDao = new SysLogsDao(model['SysLogs'])

module.exports = sysLogsDao
