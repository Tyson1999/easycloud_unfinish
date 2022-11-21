const baseDao = require('./baseDao')
const model = require('../model')

class SettingsDao extends baseDao {

}

const settingsDao = new SettingsDao(model['Settings'])

module.exports = settingsDao
