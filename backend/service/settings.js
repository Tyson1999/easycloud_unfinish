const settingsDao = require('../model/Dao/settingsDao')
const axios = require('axios')

/* * * * * * * * * 系统参数部分 * * * * * * * * */

/**
 * 检查已上传文件的状态
 * @param ids k2s文件ID数组
 * @returns {Promise<AxiosResponse<any>>}
 */
function getK2sFileStatus(ids) {
    const url = K2S_API_PREFIX + '/getFilesInfo'
    return axios.post(url, {ids})
}

async function checkAbnormalFiles() {
    // 检查上传异常
    // 检查过期文件
    const sql = `SELECT * FROM file JOIN file_attrs WHERE file.id = file_attrs.file_id AND status = 'completed'`
    // let files = await db.querySql(sql)
    const k2s_ids = []
    files.forEach(file => {
        k2s_ids.push(file['k2s_id'])
    })
    const res = await getK2sFileStatus(k2s_ids)

    files = res['data']['files']
    // 查询并更新过期/失效的文件
    files.forEach(file => {
        if (!file['is_available']) {
            const k2s_id = file['id']
            const detail_desc = 'file expired or been report abuse'
        }
    })
}

async function getSystemSettings() {
    const settings = await settingsDao.findAll()
    const settingsObj = {}
    settings.forEach(item => {
        settingsObj[item['name']] = item['value']
    })
    return settingsObj
}


module.exports = {
    checkAbnormalFiles,
    getSystemSettings
}
