const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class SysLogs extends Model {
    static associate(model) {
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

SysLogs.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    level: {
        type: DataTypes.CHAR(16),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {sequelize, modelName: 'sys_logs', timestamps: false, freezeTableName: true})

module.exports = SysLogs
