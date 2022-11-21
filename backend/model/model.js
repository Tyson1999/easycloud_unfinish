/**
 * 聚合所有model
 * 也可参考：https://codebysamgan.com/how-to-create-model-association-in-sequelize-express-js-node-js 修改代码
 */

const fs = require('fs')
const {sequelize} = require('../db')

let files = fs.readdirSync(__dirname + '/mysql')

let js_files = files.filter((f) => {
    return f.endsWith('.js')
}, files)

for (let f of js_files) {
    // console.log(`import model from file ${f}...`)
    const name = f.substring(0, f.length - 3)
    module.exports[name] = require(__dirname + '/mysql/' + f)
}

// handle association
for (let f of js_files) {
    const name = f.substring(0, f.length - 3)
    module.exports[name].associate(module.exports)
}

module.exports.sync = () => {
    sequelize.sync()
}

// why can't ?
// module.exports.sync = sequelize.sync
