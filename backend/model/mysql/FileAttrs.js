const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class FileAttrs extends Model {
    static associate(model) {
        this.belongsTo(model.File, {
            foreignKey: 'file_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.belongsTo(model.Policy, {
            foreignKey: 'policy_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

FileAttrs.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(300),
        comment: '远程文件存储路径或标识码'
    },
    policy_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_upload_time: {
        type: DataTypes.DATE
    },
    finish_upload_time: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.CHAR(50)
    },
    comment: {
        type: DataTypes.TEXT
    }
}, {sequelize, modelName: 'file_attrs', timestamps: false, freezeTableName: true})

module.exports = FileAttrs
