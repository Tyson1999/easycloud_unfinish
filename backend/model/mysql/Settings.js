const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class Settings extends Model {
    static associate(model) {
    }
}

Settings.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.CHAR(50),
        allowNull: false,
        comment: '设置项名'
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '设置项值'
    }
}, {sequelize, modelName: 'settings', timestamps: false, freezeTableName: true})

module.exports = Settings
