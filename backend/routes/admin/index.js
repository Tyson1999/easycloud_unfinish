const {decoded} = require('../../utils/index')
const {getUserById} = require('../../service/user')

function isAdmin(ctx) {
    return new Promise(async (resolve, reject) => {
        const {userId} = decoded(ctx.headers['authorization'], ctx)
        if (userId) {
            // 获得角色权限
            const {roles} = await getUserById(userId)
            if (roles.indexOf('admin') !== -1) {
                resolve(userId)
            } else {
                resolve(null)
            }
        }
    })
}

module.exports = {
    isAdmin
}
