import Colaborador from './Colaborador.js';
import Veiculo from './Veiculo.js';
import HistoricoUtilizacaoVeiculo from './HistoricoUtilizacaoVeiculo.js';
import Infracao from './Infracao.js';

HistoricoUtilizacaoVeiculo.belongsTo(Colaborador, { foreignKey: 'colaboradorUid', targetKey: 'uidMSK' });
Colaborador.hasMany(HistoricoUtilizacaoVeiculo, { foreignKey: 'colaboradorUid', sourceKey: 'uidMSK' });

HistoricoUtilizacaoVeiculo.belongsTo(Veiculo, { foreignKey: 'veiculoPlaca', targetKey: 'placa' });
Veiculo.hasMany(HistoricoUtilizacaoVeiculo, { foreignKey: 'veiculoPlaca', sourceKey: 'placa' });

Infracao.belongsTo(Colaborador, { foreignKey: 'colaboradorUid', targetKey: 'uidMSK' });
Colaborador.hasMany(Infracao, { foreignKey: 'colaboradorUid', sourceKey: 'uidMSK' });

Infracao.belongsTo(Veiculo, { foreignKey: 'placaVeiculo', targetKey: 'placa' });
Veiculo.hasMany(Infracao, { foreignKey: 'placaVeiculo', sourceKey: 'placa' });