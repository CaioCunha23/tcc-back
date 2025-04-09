import { Sequelize } from 'sequelize'
import database from '../db/database.js'

export const Infracao = database.define('infracao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    colaboradorUid: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
            model: 'colaboradores',
            key: 'uidMSK'
        }
    },
    placaVeiculo: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'veiculos',
            key: 'placa'
        }
    },
    costCenter: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dataInfracao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: true
    },
    hora: {
        type: Sequelize.STRING,
        allowNull: true
    },
    valor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        get() {
            return this.getDataValue('valor') * 100;
        }
    },
    prefixo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    marca: {
        type: Sequelize.STRING,
        allowNull: true
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rodovia: {
        type: Sequelize.STRING,
        allowNull: true
    },
    praca: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dataEnvio: {
        type: Sequelize.DATE,
        allowNull: true
    },
    codigoMulta: {
        type: Sequelize.STRING,
        allowNull: true
    },
    indicacaoLimite: {
        type: Sequelize.STRING,
        allowNull: true
    },
    statusResposta: {
        type: Sequelize.STRING,
        allowNull: true
    },
    reconhecimento: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    enviadoParaRH: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
    }
},
    {
        tableName: 'infracoes'
    }
);

export default Infracao;