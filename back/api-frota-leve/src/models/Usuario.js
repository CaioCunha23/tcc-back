import { Sequelize } from 'sequelize'
import database from '../db/database.js'

export const AuthUser = database.define('auth_user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    uidMSK: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        defaultValue: 'default'
    }
}, {
    tableName: 'auth_users',
    timestamps: true
})

export default AuthUser