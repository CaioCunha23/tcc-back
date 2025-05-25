import { Sequelize } from 'sequelize'
import database from '../db/database.js'

export const Colaborador = database.define('colaborador', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
        allowNull: true,
    },
    type: {
        type: Sequelize.STRING,
        defaultValue: 'default'
    },
    localidade: {
        type: Sequelize.STRING(5),
        allowNull: false
    },
    brand: {
        type: Sequelize.STRING,
        allowNull: false
    },
    jobTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
    },
    usaEstacionamento: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    cidadeEstacionamento: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    cnh: {
        type: Sequelize.STRING(9),
        allowNull: false
    },
    tipoCNH: {
        type: Sequelize.STRING,
        allowNull: false
    },
},
    {
        tableName: "colaboradores",
    })

export default Colaborador