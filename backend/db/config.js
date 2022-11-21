const {DEV} = require('../utils/constant')

dev_db = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'easycloud_uploader'
}

prod_db = {
    host: '127.0.0.1',
    user: 'easycloud_uploader',
    password: 'RrXbd8cCX2KDbpRj',
    database: 'easycloud_uploader'
}


module.exports = DEV ? dev_db : prod_db
