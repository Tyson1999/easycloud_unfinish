const baseDao = require('./baseDao')
const CreatorCategory = require('../mysql/CreatorCategory')

class CreatorCategoryDao extends baseDao {
}

const creatorCategoryDao = new CreatorCategoryDao(CreatorCategory)

module.exports = creatorCategoryDao
