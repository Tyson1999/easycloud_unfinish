/**
 * 首次部署环境时，此脚本可一键生成全新数据库
 */
const model = require('./model/model')

model.sync()
