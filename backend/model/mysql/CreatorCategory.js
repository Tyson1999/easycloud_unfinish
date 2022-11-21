const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class CreatorCategory extends Model {
    static associate(model) {
        this.hasMany(model.Creator, {
            foreignKey: 'category',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

CreatorCategory.init({
    // 在这里定义模型属性
    id: {
        type: DataTypes.INTEGER,
        // allowNull 默认为 true
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    value: {
        type: DataTypes.CHAR(20),
        allowNull: false
    }
}, {sequelize, modelName: 'creator_category', timestamps: false, freezeTableName: true})


module.exports = CreatorCategory
