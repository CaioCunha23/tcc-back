import { Sequelize } from 'sequelize'
import database from '../db/database.js'

export const HistoricoUtilizacaoVeiculo = database.define('historico_utilizacao_veiculo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    veiculoPlaca: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'veiculos',
            key: 'placa'
        }
    },
    dataInicio: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dataFim: {
        type: Sequelize.DATE,
        allowNull: true
    },
    tipoUso: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: "historico_utilizacao_veiculos"
})

export default HistoricoUtilizacaoVeiculo
