const DEV = true
const DEBUG = false
const DOMAIN = DEV ? 'http://localhost:9527' : 'https://storage.easycloud.org'
const K2sDomains = ['k2s.cc', 'fboom.me', 'tezfiles.com']
const OAUTH_REDIRECT_URL = DOMAIN + '/policy/management'

module.exports = {
    DEV,
    DEBUG,
    K2sDomains,
    DOMAIN,
    OAUTH_REDIRECT_URL,
    CODE_ERROR: -1,
    CODE_SUCCESS: 1,
    CODE_TOKEN_EXPIRED: -2,
    // JWT
    JWT_PRIVATE_KEY: '',
    JWT_EXPIRED: 60 * 60 * 60,
    // WP JWP
    WP_JWT_PRIVATE_KEY: '',
    // password salt
    SALT: '',
    // fileId AES key
    AES_KEY: '',
    // API key
    SESSION_KEY: '',
    // 需先建立顶级根目录
    STORE_ROOT_PATH: DEV ? '/Users/user/Desktop/Store' : '/home/easycloud-uploader/Store',
    FTP_ROOT_PATH: DEV ? '/Users/user/Desktop/FTP' : '/home/easycloud-uploader/FTP',
    FTP_SUB_FOLDERS_PATH: ['']
}
