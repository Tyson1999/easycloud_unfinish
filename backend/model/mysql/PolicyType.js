const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../../db')

class PolicyType extends Model {
    static associate(model) {
        this.hasMany(model.Policy, {
            foreignKey: 'policy_type_id',
            onUpdate: 'RESTRICT',
            onDelete: 'CASCADE'
        })
    }
}

PolicyType.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    endpoint: {
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: ''
    },
    bucket_name: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    secret_key: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'refresh token 过期时间',
        defaultValue: '1970-01-01 00:00:00'
    },
    permission: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    is_aggregation: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {sequelize, modelName: 'policy_type', timestamps: false, freezeTableName: true})

module.exports = PolicyType
