const model = require('../model')

class baseDao {
    constructor(model) {
        this.model = model
    }

    findAll(options = {}) {
        if (!options['raw']) {
            options['raw'] = true
        }
        return this.model.findAll(options)
    }

    findOne(options = {}) {
        if (!options['raw']) {
            options['raw'] = true
        }
        return this.model.findOne(options)
    }

    findOneBy(condition = {}, options = {}) {
        options['where'] = condition
        if (!options['raw']) {
            options['raw'] = true
        }
        return this.model.findOne(options)
    }

    joinWith(includeModel, includeParams = {}, options = {}) {
        if (!options['raw']) {
            options['raw'] = true
        }
        options['include'] = {
            model: model[includeModel],
            ...includeParams
        }
        return this.model.findAll(options)
    }

    insertOne(object) {
        return this.model.create(object)
    }

    updateOne(object, where) {
        return this.model.update(object, {where})
    }

    deleteOne(where) {
        return this.model.destroy({where})
    }

    count(options) {
        return this.model.count(options)
    }
}


module.exports = baseDao
