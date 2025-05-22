import { Sequelize } from 'sequelize'
import database from '../db/database.js'

export const Veiculo = database.define('veiculo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    fornecedor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contrato: {
        type: Sequelize.STRING,
        allowNull: false
    },
    placa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    renavam: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    chassi: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    modelo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cliente: {
        type: Sequelize.STRING,
        allowNull: false
    },
    perfil: {
        type: Sequelize.STRING,
        allowNull: false
    },
    centroCusto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    franquiaKM: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    carroReserva: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    dataDisponibilizacao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    mesesContratados: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    previsaoDevolucao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    mesesFaltantes: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    mensalidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get() {
            return this.getDataValue('mensalidade') * 100;
        }
    },
    budget: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get() {
            return this.getDataValue('budget') * 100;
        }
    },
    multa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get() {
            return this.getDataValue('multa') * 100;
        }
    },
    proximaRevisao: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

export default Veiculo