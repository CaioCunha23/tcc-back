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
router.post('/forgot-password', authService.forgotPassword);
router.put('/reset-password/:token', authService.resetPassword);


router.post('/colaborador', colaboradoresController.createWorker);
router.post('/colaboradores/import', upload.single('file'), colaboradoresController.importWorkerCSV);
router.get('/colaboradores', colaboradoresController.getWorkers);
router.get('/colaborador/:id', colaboradoresController.getWorkerById);
router.get('/colaborador/uid/:uidMSK', colaboradoresController.getWorkerByMskID);
router.put('/colaborador/:id', colaboradoresController.updateWorker);
router.delete('/colaborador/:id', colaboradoresController.deleteWorker);

router.post('/veiculo', veiculosController.createVehicle);
router.post('/veiculos/import', upload.single('file'), veiculosController.importVehicleCSV);
router.get('/veiculos', veiculosController.getVehicles);
router.get('/veiculo/:id', veiculosController.getVehicleByID);
router.get('/veiculo/:uidMSK', veiculosController.getVehicleByMskID);
router.get('/veiculo/:placa', veiculosController.getVehicleByPlate);
router.put('/veiculo/:id', veiculosController.updateVehicle);
router.delete('/veiculo/:id', veiculosController.deleteVehicle);

router.post('/historico', historicoUtilizacaoVeiculosController.createHistorico);
router.get('/historicos', historicoUtilizacaoVeiculosController.getHistoricos);
router.get('/historico/:id', historicoUtilizacaoVeiculosController.getHistoricoById);
router.put('/historico/:id', historicoUtilizacaoVeiculosController.updateHistorico);
router.delete('/historico/:id', historicoUtilizacaoVeiculosController.deleteHistorico);
router.post("/historico-utilizacao/iniciar", authService.checaToken, historicoUtilizacaoVeiculosController.startUse);
router.post("/historico-utilizacao/finalizar", authService.checaToken, historicoUtilizacaoVeiculosController.finishUse);

router.post('/infracao', infracoesController.createInfracao);
router.post('/infracoes/import', upload.single('file'), infracoesController.importInfractionCSV);
router.get('/infracoes', infracoesController.getInfracoes);
router.get('/infracao/:id', infracoesController.getInfracaoById);
router.get('/infracoes/:uidMSK', infracoesController.getInfracaoByUidMSK);
router.put('/infracao/:id', infracoesController.updateInfracao);
router.delete('/infracao/:id', infracoesController.deleteInfracao);

router.get('/dashboard-metrics', authService.checaToken, dashboardMetricsController.getDashboardMetrics);
router.get('/infracoes-chart-data', dashboardMetricsController.getInfracoesChartData);
router.get('/dashboard-metrics-colaborador-maior-aumento', authService.checaToken, dashboardMetricsController.getColaboradorMaiorAumento);
router.get('/top-offenders', dashboardMetricsController.getTopOffenders);
router.get('/veiculos-devolucao', dashboardMetricsController.getVeiculosContratoProximo);
router.get('/vencimento-multas', dashboardMetricsController.getMultasProximasVencer);

export default router;