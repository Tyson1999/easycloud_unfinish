const userDao = require('../model/Dao/userDao')
const {getSHA2} = require('../utils')

function getUserByUsernameAndPassword(username, password) {
    password = getSHA2(password)
    const option = {
        where: {username, password}
    }
    return userDao.findOne(option)
}

function getUserById(userId) {
    return userDao.findOne({
        attributes: {exclude: 'password'},
        where: {id: userId}
    })
}

function getUsers() {
    return userDao.findAll({
        attributes: {exclude: 'password'}
    })
}

function updateUser(model) {
    if (model['password']) {
        model['password'] = getSHA2(model['password'])
    }
    return userDao.updateOne(model, {
        id: model['id']
    })
}

function addUser(model) {
    model['password'] = getSHA2(model['password'])
    return userDao.insertOne(model)
}


module.exports = {
    getUserByUsernameAndPassword,
    getUserById,
    getUsers,
    updateUser,
    addUser
}
