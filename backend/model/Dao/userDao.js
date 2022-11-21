const baseDao = require('./baseDao')
const model = require('../model')

class UserDao extends baseDao {

}

const userDao = new UserDao(model['User'])

module.exports = userDao
