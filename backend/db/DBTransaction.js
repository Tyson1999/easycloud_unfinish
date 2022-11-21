/**
 * Edit the code from https://blog.csdn.net/Javon_huang/article/details/96157277
 */
class DBTransaction {
    constructor(connection) {
        this.connection = connection
        this.blTransaction = false
    }

    async beginTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((err, success) => {
                if (err) {
                    this.blTransaction = false
                    reject(err)
                } else {
                    this.blTransaction = true
                    resolve(success)
                }
            })
        })
    }

    async querySql(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, result) => {
                if (!this.blTransaction) {
                    this.connection.release()
                    reject(new Error('事务未开启'))
                }
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    async commit() {
        return new Promise((resolve, reject) => {
            this.connection.commit((err) => {
                if (err) {
                    this.connection.release()
                    reject(err)
                } else {
                    this.connection.release()
                    resolve()
                }
            })
        })
    }

    async rollback() {
        this.connection.rollback(() => {
            this.connection.release()
        })
    }

}

module.exports = DBTransaction
