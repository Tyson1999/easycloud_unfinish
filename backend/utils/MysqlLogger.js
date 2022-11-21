const {addOneRecord} = require('../service/sys_logs')

const mysqlLogger = {
    info: (userId, message) => {
        return addOneRecord(userId, message, 'info')
    },
    warning: (userId, message) => {
        return addOneRecord(userId, message, 'warning')
    },
    error: (userId, message) => {
        return addOneRecord(userId, message, 'error')
    }
}

module.exports = mysqlLogger
