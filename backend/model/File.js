const fs = require('fs')
const Path = require('path')

const {STORE_ROOT_PATH, FTP_SUB_FOLDERS_PATH, FTP_ROOT_PATH} = require('../utils/constant')
const {formatTime} = require('../utils/index')
const {getFileById} = require('../service/file')

class File {
    constructor() {
    }

    /**
     * 获取用户FTP文件夹内的文件
     * @param uploader 用户名
     * @param uploaderId 用户ID
     * @returns {*[]}
     */
    static getLocalFiles(uploader, uploaderId) {
        const ext_arr = ['.zip', '.7z', '.rar']
        const user_FTP_path = FTP_ROOT_PATH + `/${uploader}`
        let index = 0
        const files_arr = []
        for (const sub_path of FTP_SUB_FOLDERS_PATH) {
            const full_path = Path.join(user_FTP_path, sub_path)
            let category = sub_path.split('/')[1]
            if (!category)
                category = 'default'
            fs.readdirSync(full_path).map((file) => {
                file = full_path + `/${file}`
                const stat = fs.statSync(file)
                if (!stat.isDirectory()) {
                    if (ext_arr.includes(Path.extname(file).toLowerCase())) {
                        index += 1
                        const fileName = Path.basename(file)
                        const fileInStoreTime = formatTime(fs.statSync(file).ctime)
                        const fileObj = {
                            id: index,
                            user_id: uploaderId,
                            category,
                            uploader: uploader,
                            file_name: fileName,
                            file_in_store_time: fileInStoreTime, // 前端使用
                            file_path: file,
                            file_size: fs.statSync(file).size // Byte
                        }
                        files_arr.push(fileObj)
                    }
                }
            })
        }
        return files_arr
    }

    fromDB(id) {
        return new Promise(async (resolve) => {
            const file_obj = await getFileById(id)
            delete file_obj['id']
            this.id = id
            this.file_name = file_obj['file_name']
            this.category = file_obj['category']
            this.file_hash = file_obj['file_hash']
            this.user_id = file_obj['user_id']
            this.file_size = file_obj['file_size']
            this.file_path = STORE_ROOT_PATH + `/${file_obj['file_path']}`
            resolve(this)
        })
    }

    fromObject(file_obj) {
        this.file_name = file_obj['file_name']
        this.user_id = file_obj['user_id']
        this.category = file_obj['category']
        this.file_hash = file_obj['file_hash']
        this.uploader = file_obj['uploader']
        this.file_size = file_obj['file_size']
        this.file_path = file_obj['file_path']
        this.status = file_obj['status']
        return this
    }
}

module.exports = File
