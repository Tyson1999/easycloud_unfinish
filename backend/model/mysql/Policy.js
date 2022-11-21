const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class Policy extends Model {
    static associate(model) {
        this.belongsTo(model.PolicyType, {
            foreignKey: 'policy_type_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
        this.hasMany(model.FileAttrs, {
            foreignKey: 'policy_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

Policy.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    policy_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    space_used: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    account_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    access_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'access token 过期时间',
        defaultValue: '1970-01-01 00:00:00'
    },
    root_folder: {
        type: DataTypes.CHAR(150),
        allowNull: false,
        defaultValue: '',
        comment: '文件存储的根目录'
    },
    is_active: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_system_policy: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '所有者用户ID'
    }
}, {sequelize, modelName: 'policy', timestamps: false, freezeTableName: true})

module.exports = Policy
