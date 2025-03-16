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
    renavan: {
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
    uidMSK: {
        type: Sequelize.STRING(9),
        allowNull: false,
        references: {
            model: 'colaboradores',
            key: 'uidMSK'
        }
    },
    perfil: {
        type: Sequelize.STRING,
        allowNull: false
    },
    jobLevel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricaoCargo: {
        type: Sequelize.TEXT,
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
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    budget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    multa: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    proximaRevisao: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

export default Veiculo
