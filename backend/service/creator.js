const {Op} = require('sequelize')
const CreatorCategoryDao = require('../model/Dao/creatorCategoryDao')
const CreatorDao = require('../model/Dao/creatorDao')

function getCreatorCategory() {
    return CreatorCategoryDao.findAll()
}

function addOneCreator(model) {
    model = trim(model)
    return CreatorDao.insertOne(model)
}

function checkDuplicateCreator(model) {
    model = trim(model)
    const id = model['id']
    const creatorName = model['creator_name']
    let options = {where: {}}
    // 是修改作者，要检查ID
    if (id) {
        options['where'] = {
            id: {
                [Op.not]: id
            },
            creator_name: creatorName
        }
    } else {
        options['where'] = {
            creator_name: creatorName
        }
    }
    return CreatorDao.findOne(options)
}

function getCreatorsById(creatorId) {
    return CreatorDao.findOne({
        where: {
            id: creatorId
        }
    })
}

function getCreatorsByName(creatorName) {
    return CreatorDao.getCreatorByNameLike(creatorName)
}

function editOneCreator(model) {
    model = trim(model)
    const where = {
        creator_name: model['creator_name']
    }
    return CreatorDao.updateOne(model, where)
}

function trim(object) {
    Object.keys(object).forEach(key => {
        if (typeof (object[key]) === 'string') {
            object[key] = object[key].trim()
        }
    })
    return object
}

module.exports = {
    getCreatorCategory,
    addOneCreator,
    checkDuplicateCreator,
    getCreatorsByName,
    getCreatorsById,
    editOneCreator
}
