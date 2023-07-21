const { Model, DataTypes, STRING } = require('sequelize');
const sequelize = require('../config/connection');

class Employee extends Model {}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        first_Name: {
            allowNull: false
        },
        last_name: {
            allowNull: false
        }, 
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'role',
                key: 'id'
            },
            // TODO: Define manager_id
        },
    },
    {      
        sequelize: sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: 'employee'
    }
)

module.exports = Employee;