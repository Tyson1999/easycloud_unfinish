const fs = require('fs')
const Path = require('path')

const fileDao = require('../model/Dao/fileDao')
const creatorService = require('./creator')
const MysqlLogger = require('../utils/MysqlLogger')
const {STORE_ROOT_PATH, FTP_SUB_FOLDERS_PATH, DEV, FTP_ROOT_PATH} = require('../utils/constant')

/**
 * 数据结构：[{id:1, category:3d,..., finish_upload_time:{k2s: 'xxxx-xx-xx',...}, download_link: {k2s: 'xxxxx'...}}]
 * @param userId
 * @param query
 * @returns {Promise<unknown>}
 */
function listExistFiles(userId, query) {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                category,
                display_name,
                page,
                pageSize,
                sort,
                status
            } = query
            const offset = (page - 1) * pageSize
            // 从file表获取信息
            // let sql = `select distinct \`file\`.id, \`display_name\`, \`category\`, \`uploader\`, \`file_size\`, \`file_path\` FROM \`file\` `
            // sql = `${sql}JOIN \`file_attrs\` ON \`file_attrs\`.file_id = \`file\`.id`
            const options = {}
            options['where'] = {}
            category && (options['where']['category'] = category)
            status && (options['where']['status'] = status)
            display_name && (options['where']['display_name'] = display_name)
            if (sort) {
                const symbol = sort[0]
                const prop = sort.slice(1)
                const order = symbol === '+' ? 'ASC' : 'DESC'
                options['order'] = [[prop, order]]
            }
            options['limit'] = Number(pageSize)
            options['offset'] = Number(offset)
            const fileData = await fileDao.findAll(options)
            // 增加creatorId 对应的 creatorName
            for (const row of fileData) {
                if (row['creator_id'] !== 0) {
                    row['creator_name'] = (await creatorService.getCreatorsById(row['creator_id']))['creator_name']
                }
            }
            const count = await fileDao.count({where: options['where']})
            // 将id改为file_id，增加自增的id
            for (let i = 0; i < fileData.length; i++) {
                fileData[i]['file_id'] = fileData[i]['id']
                fileData[i]['id'] = i + 1
            }
            resolve({fileData, count, page, pageSize})
        } catch (err) {
            reject(err)
        }
    })
}

function createFileRecord(params) {
    const file_name = params['file_name']
    const user_id = params['user_id']
    const display_name = params['display_name']
    const category = params['category']
    const file_path = params['file_path']
    const file_size = params['file_size']
    const file_hash = params['file_hash']

    const model = {
        file_name,
        user_id,
        display_name,
        category,
        file_path,
        file_size,
        file_hash
    }
    return fileDao.insertOne(model)
}

function updateOneFile(model, fileId) {
    return fileDao.updateOne(model, {id: fileId})
}

function deleteFileRecord(id) {
    return fileDao.deleteOne({id})
}

function getFileById(file_id) {
    return fileDao.findOne({
        where: {id: file_id}
    })
}

function getFileByHash(hash) {
    return fileDao.findOne({
        where: {file_hash: hash}
    })
}

/**
 * 将文件移动至store目录内
 */
function initFileUpload(file_obj) {
    return new Promise((resolve, reject) => {
        const file_path = file_obj['file_path']
        const uploader = file_obj['uploader']
        const file_name = file_obj['file_name']
        const dest_file_path = STORE_ROOT_PATH + `/${uploader}/${file_name}`

        fs.rename(file_path, dest_file_path, (err) => {
            if (err) reject(err)
            else {
                file_obj['file_path'] = dest_file_path
                file_obj['file_relative_path'] = Path.relative(STORE_ROOT_PATH, file_obj['file_path'])
                resolve()
            }
        })
    })
}

/**
 * 删除本地文件
 */
function deleteOneFile(filePath) {
    fs.unlinkSync(filePath)
}

function initUserFTPFolders(user) {
    const {username, userId} = user
    const FTP_path = FTP_ROOT_PATH + `/${username}`
    // 是否存在主文件夹
    if (!fs.existsSync(FTP_path)) {
        fs.mkdirSync(FTP_path)
        MysqlLogger.info(userId, `创建文件夹 ${FTP_path} 成功`)
    }
    // 是否存在三个子文件夹
    for (let path of FTP_SUB_FOLDERS_PATH) {
        path = FTP_path + path
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
            !DEV && fs.chownSync(path, 1000, 1000)
            MysqlLogger.info(userId, `创建文件夹 ${path} 成功`)
        }
    }
}

function initUserStoreFolders(user) {
    const {username, userId} = user
    const store_path = STORE_ROOT_PATH + `/${username}`
    // 是否存在主文件夹
    if (!fs.existsSync(store_path)) {
        fs.mkdirSync(store_path)
        !DEV && fs.chownSync(store_path, 1000, 1000)
        MysqlLogger.info(userId, `创建文件夹 ${store_path} 成功`)
    }
}

function getFileCategory(userId) {
    return fileDao.getFileCategoryByUserId(userId)
}


module.exports = {
    listExistFiles,
    createFileRecord,
    getFileById,
    getFileByHash,
    deleteFileRecord,
    initUserFTPFolders,
    initUserStoreFolders,
    initFileUpload,
    deleteOneFile,
    updateOneFile,
    getFileCategory
}
