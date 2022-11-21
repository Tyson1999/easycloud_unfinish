// 需要外键吗？https://www.zhihu.com/question/19600081
const mysql = require('mysql')
const {DEBUG} = require('../utils/constant')
const {escape} = require('mysql')

const {
    host,
    user,
    password,
    database
} = require('./config')


const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    multipleStatements: true
})


function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                resolve(connection)
            }
        })
    })
}

// 可以把callback转为promise
// https://segmentfault.com/a/1190000038232925
function querySql(sql) {
    DEBUG && console.log(sql)
    return new Promise((resolve, reject) => {
        getConnection()
            .then(connection => {
                connection.query(sql, (err, results) => {
                    if (err) {
                        DEBUG && console.log('查询失败，原因:' + JSON.stringify(err))
                        reject(err)
                    } else {
                        DEBUG && console.log('查询成功', JSON.stringify(results))
                        resolve(results)
                    }
                    connection.release()
                })
            })
            .catch(err => {
                DEBUG && console.log('获取连接池失败:' + JSON.stringify(err))
                reject(err)
            })
    })
}

function queryOne(sql) {
    return new Promise((resolve, reject) => {
        querySql(sql).then(results => {
            if (results && results.length > 0) {
                resolve(results[0])
            } else {
                resolve(null)
            }
        }).catch(e => {
            reject(e)
        })
    })
}

function and(where, k, v) {
    if (where === 'where') {
        where = `where \`${k}\` = '${v}'`
    } else {
        where = `${where} AND \`${k}\` = '${v}'`
    }
    return where
}

function andLike(where, k, v) {
    if (where === 'where') {
        where = `where \`${k}\` LIKE '%${v}%'`
    } else {
        where = `${where} AND \`${k}\` LIKE '%${v}%'`
    }
    return where
}

function insert(table, model) {
    return new Promise((resolve, reject) => {
        const keys = []
        const values = []
        Object.keys(model).forEach(key => {
            if (model.hasOwnProperty(key)) {
                keys.push(`\`${key}\``) // 防止关键字
                values.push(`${escape(model[key])}`)
            }
        })
        if (keys.length > 0 && values.length > 0) {
            let sql = `INSERT INTO \`${table}\` (`
            const keyString = keys.join(',')
            const valueString = values.join(',')
            sql = `${sql}${keyString}) VALUES ( ${valueString} )`
            querySql(sql)
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
        } else {
            reject(new Error('插入的对象属性为空'))
        }
    })
}

function update(table, model, where) {
    return new Promise((resolve, reject) => {
        const pairs = []
        Object.keys(model).forEach(key => {
            if (model.hasOwnProperty(key)) {
                pairs.push(`\`${key}\` = ${escape(model[key])}`)
            }
        })
        if (pairs.length > 0) {
            let sql = `UPDATE \`${table}\` SET`
            const pairsString = pairs.join(',')
            sql = `${sql} ${pairsString} ${where}`
            querySql(sql)
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
        } else {
            reject(new Error('更新的对象属性为空'))
        }
    })
}

// https://www.liaoxuefeng.com/wiki/1022910821149312/1101571555324224
const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})


module.exports = {
    sequelize
}


