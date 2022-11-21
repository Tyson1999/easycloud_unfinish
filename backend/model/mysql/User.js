const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class User extends Model {
    static associate(model) {
        this.hasMany(model.Policy, {
            foreignKey: 'user_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.hasMany(model.SysLogs, {
            foreignKey: 'user_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.hasMany(model.File, {
            foreignKey: 'user_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.CHAR(30),
        allowNull: false
    },
    email: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    password: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    roles: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    }
}, {sequelize, modelName: 'user', timestamps: false, freezeTableName: true})

module.exports = User
