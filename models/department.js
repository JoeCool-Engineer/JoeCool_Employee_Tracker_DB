const { Model, DataTypes, STRING } = require('sequelize')
const sequelize = require('../config/connection');

class Department extends Model {}

Department.init(
    {
        //List of fields
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.VARCHAR(30),
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: 'department',
    }
)

module.exports = Department;