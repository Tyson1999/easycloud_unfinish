const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class Creator extends Model {
    static associate(model) {
        // 关联查询
        // https://blog.csdn.net/weixin_34334554/article/details/112335677
        this.belongsTo(model.CreatorCategory, {
            foreignKey: 'category',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.hasMany(model.File, {
            foreignKey: 'creator_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

Creator.init({
    id: {
        type: DataTypes.INTEGER,
        // allowNull 默认为 true
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creator_name: {
        type: DataTypes.CHAR(50),
        allowNull: false
    },
    patreon: DataTypes.CHAR(200),
    twitter: DataTypes.CHAR(200),
    pixiv: DataTypes.CHAR(200),
    discord: DataTypes.CHAR(200)
}, {sequelize, modelName: 'creator', timestamps: false, freezeTableName: true})


module.exports = Creator
