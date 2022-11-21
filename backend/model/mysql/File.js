const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class File extends Model {
    static associate(model) {
        this.hasMany(model.FileAttrs, {
            foreignKey: 'file_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.belongsTo(model.Creator, {
            foreignKey: 'creator_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

File.init({
    id: {
        type: DataTypes.INTEGER,
        // allowNull 默认为 true
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    file_name: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '实际文件名'
    },
    display_name: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '显示文件名'
    },
    category: {
        type: DataTypes.CHAR(100),
        allowNull: false,
        comment: '作品分类'
    },
    file_hash: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '上传者ID'
    },
    file_size: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    file_path: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    creator_id: {
        type: DataTypes.INTEGER,
        comment: '所属作者',
        allowNull: false,
        defaultValue: 0
    }
}, {sequelize, modelName: 'file', timestamps: false, freezeTableName: true})


module.exports = File
