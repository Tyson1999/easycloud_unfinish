const K2s = require('../service/policy/k2s')
const Onedrive = require('../service/policy/onedrive')
const Mega = require('../service/policy/mega')
const GoogleDrive = require('../service/policy/googleDrive')
const BaiduPan = require('../service/policy/baiduPan')

/**
 * 用传入的Policy参数实例化一个策略
 * @param {Object} policy Policy的参数
 * @return {Policy | null}
 */
async function initOnePolicyInstance(policy) {
    const {id, type} = policy
    let instance = null
    switch (type) {
        case 'k2s':
            const k2s = new K2s(id)
            await k2s.init()
            instance = k2s
            break
        case 'onedrive':
            const od = new Onedrive(id)
            await od.init()
            instance = od
            break
        case 'mega':
            const mega = new Mega(id)
            await mega.init()
            instance = mega
            break
        case 'googleDrive':
            const gd = new GoogleDrive(id)
            await gd.init()
            instance = gd
            break
        case 'baiduPan':
            const bdp = new BaiduPan(id)
            await bdp.init()
            instance = bdp
            break
    }

    return instance
}


module.exports = {
    initOnePolicyInstance
}
