const sysLogsDao = require('../model/Dao/sysLogsDao')
const moment = require('moment')

async function getLogs(userId, query, isAdmin) {
    const options = {}
    const {sort, page, pageSize} = query
    if (!isAdmin) {
        options['where'] = {user_id: userId}
    }
    if (sort) {
        const symbol = sort[0]
        const prop = sort.slice(1)
        const order = symbol === '+' ? 'ASC' : 'DESC'
        options['order'] = [[prop, order]]
    }
    const offset = (page - 1) * pageSize
    options['limit'] = Number(pageSize)
    options['offset'] = Number(offset)
    const tableData = await sysLogsDao.findAllWithUsername(options)

    let index = 0
    tableData.forEach(data => {
        data['id'] = ++index
        data['username'] = data['user.username']
        delete data['user.username']
    })

    const countOptions = options['where'] ? {where: options['where']} : {}
    const count = await sysLogsDao.count(countOptions)

    return {count, tableData}
}

async function addOneRecord(userId, message, level) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')
    const model = {
        user_id: userId,
        level,
        message,
        timestamp
    }
    await sysLogsDao.insertOne(model)
}


module.exports = {
    getLogs,
    addOneRecord
}
