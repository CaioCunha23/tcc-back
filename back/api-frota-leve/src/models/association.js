import Colaborador from './Colaborador.js'
import Veiculo from './Veiculo.js'

Veiculo.belongsTo(Colaborador, { foreignKey: 'uidMSK', targetKey: 'uidMSK' });
Colaborador.hasMany(Veiculo, { foreignKey: 'uidMSK', sourceKey: 'uidMSK' });