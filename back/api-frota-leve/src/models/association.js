import Colaborador from './Colaborador.js';
import Veiculo from './Veiculo.js';
import HistoricoUtilizacaoVeiculo from './HistoricoUtilizacaoVeiculo.js';
import Infracao from './Infracao.js';

HistoricoUtilizacaoVeiculo.belongsTo(Colaborador, { foreignKey: 'colaboradorUid', targetKey: 'uidMSK' });
Colaborador.hasMany(HistoricoUtilizacaoVeiculo, { foreignKey: 'colaboradorUid', sourceKey: 'uidMSK' });

HistoricoUtilizacaoVeiculo.belongsTo(Veiculo, { foreignKey: 'veiculoId', targetKey: 'id' });
Veiculo.hasMany(HistoricoUtilizacaoVeiculo, { foreignKey: 'veiculoId', sourceKey: 'id' });

Infracao.belongsTo(Colaborador, { foreignKey: 'colaboradorUid', targetKey: 'uidMSK' });
Colaborador.hasMany(Infracao, { foreignKey: 'colaboradorUid', sourceKey: 'uidMSK' });

Infracao.belongsTo(Veiculo, { foreignKey: 'veiculoId', targetKey: 'id' });
Veiculo.hasMany(Infracao, { foreignKey: 'veiculoId', sourceKey: 'id' });