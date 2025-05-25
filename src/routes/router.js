import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

import authService from '../services/authService.js';
import veiculosController from '../controllers/veiculosController.js';
import colaboradoresController from '../controllers/colaboradoresController.js';
import historicoUtilizacaoVeiculosController from '../controllers/historicoUtilizacaoVeiculosController.js';
import infracoesController from '../controllers/infracoesController.js';
import dashboardMetricsController from '../controllers/metricsController.js';

router.post('/login', authService.login);
router.post('/eu', authService.pegarUsuarioDoToken);
router.post('/first-access', authService.checkEmail);
router.put('/colaborador/:uidMSK/password', authService.setPassword);

router.post('/colaborador', colaboradoresController.createWorker);
router.post('/colaboradores/import', upload.single('file'), colaboradoresController.importWorkerCSV);
router.get('/colaboradores', colaboradoresController.getWorkers);
router.get('/colaborador/:id', colaboradoresController.getWorkerById);
router.get('/colaborador/:uidMSK', colaboradoresController.getWorkerByMskID);
router.put('/colaborador/:id', colaboradoresController.updateWorker);
router.delete('/colaborador/:id', colaboradoresController.deleteWorker);

router.post('/veiculo', veiculosController.createVehicle);
router.post('/veiculos/import', upload.single('file'), veiculosController.importVehicleCSV);
router.get('/veiculos', veiculosController.getVehicles);
router.get('/veiculo/:id', veiculosController.getVehicleByID);
router.get('/veiculo/:uidMSK', veiculosController.getVehicleByMskID);
router.get('/veiculo/:placa', veiculosController.getVehicleByPlate);
router.get('/veiculo/:placa/qrcode.svg', veiculosController.getQRCode);
router.put('/veiculo/:id', veiculosController.updateVehicle);
router.delete('/veiculo/:id', veiculosController.deleteVehicle);

router.post('/historico', historicoUtilizacaoVeiculosController.createHistorico);
router.post('/veiculo/:placa/uso', historicoUtilizacaoVeiculosController.startUsoViaQr);
router.get('/historicos', historicoUtilizacaoVeiculosController.getHistoricos);
router.get('/historico/:id', historicoUtilizacaoVeiculosController.getHistoricoById);
router.put('/historico/:id', historicoUtilizacaoVeiculosController.updateHistorico);
router.put('/veiculo/:placa/uso', historicoUtilizacaoVeiculosController.endUsoViaQr);
router.delete('/historico/:id', historicoUtilizacaoVeiculosController.deleteHistorico);

router.post('/infracao', infracoesController.createInfracao);
router.post('/infracoes/import', upload.single('file'), infracoesController.importInfractionCSV);
router.get('/infracoes', infracoesController.getInfracoes);
router.get('/infracao/:id', infracoesController.getInfracaoById);
router.get('/infracoes/:uidMSK', infracoesController.getInfracaoByUidMSK);
router.put('/infracao/:id', infracoesController.updateInfracao);
router.delete('/infracao/:id', infracoesController.deleteInfracao);

router.get('/dashboard-metrics', dashboardMetricsController.getDashboardMetrics);
router.get('/infracoes-chart-data', dashboardMetricsController.getInfracoesChartData);
router.get('/dashboard-metrics-colaborador-maior-aumento', dashboardMetricsController.getColaboradorMaiorAumento);
router.get('/top-offenders', dashboardMetricsController.getTopOffenders);
router.get('/veiculos-manutencao', dashboardMetricsController.getVeiculosProximosManutencao);
router.get('/vencimento-multas', dashboardMetricsController.getMultasProximasVencer);

export default router;