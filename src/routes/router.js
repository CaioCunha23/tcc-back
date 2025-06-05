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


router.post('/colaborador', authService.checaToken, colaboradoresController.createWorker);
router.post('/colaboradores/import', authService.checaToken, upload.single('file'), colaboradoresController.importWorkerCSV);
router.get('/colaboradores', authService.checaToken, colaboradoresController.getWorkers);
router.get('/colaborador/:id', authService.checaToken, colaboradoresController.getWorkerById);
router.get('/colaborador/uid/:uidMSK', authService.checaToken, colaboradoresController.getWorkerByMskID);
router.put('/colaborador/:id', authService.checaToken, colaboradoresController.updateWorker);
router.delete('/colaborador/:id', authService.checaToken, colaboradoresController.deleteWorker);

router.post('/veiculo', authService.checaToken, veiculosController.createVehicle);
router.post('/veiculos/import', authService.checaToken, upload.single('file'), veiculosController.importVehicleCSV);
router.get('/veiculos', authService.checaToken, veiculosController.getVehicles);
router.get('/veiculo/:id', authService.checaToken, veiculosController.getVehicleByID);
router.get('/veiculo/:uidMSK', authService.checaToken, veiculosController.getVehicleByMskID);
router.get('/veiculo/:placa', authService.checaToken, veiculosController.getVehicleByPlate);
router.put('/veiculo/:id', authService.checaToken, veiculosController.updateVehicle);
router.delete('/veiculo/:id', authService.checaToken, veiculosController.deleteVehicle);

router.post('/historico', authService.checaToken, historicoUtilizacaoVeiculosController.createHistorico);
router.get('/historicos', authService.checaToken, historicoUtilizacaoVeiculosController.getHistoricos);
router.get('/historico/:id', authService.checaToken, historicoUtilizacaoVeiculosController.getHistoricoById);
router.put('/historico/:id', authService.checaToken, historicoUtilizacaoVeiculosController.updateHistorico);
router.delete('/historico/:id', authService.checaToken, historicoUtilizacaoVeiculosController.deleteHistorico);
router.post("/historico-utilizacao/iniciar", authService.checaToken, historicoUtilizacaoVeiculosController.startUse);
router.post("/historico-utilizacao/finalizar", authService.checaToken, historicoUtilizacaoVeiculosController.finishUse);

router.post('/infracao', authService.checaToken, infracoesController.createInfracao);
router.post('/infracoes/import', authService.checaToken, upload.single('file'), infracoesController.importInfractionCSV);
router.get('/infracoes', authService.checaToken, infracoesController.getInfracoes);
router.get('/infracao/:id', authService.checaToken, infracoesController.getInfracaoById);
router.get('/infracoes/:uidMSK', authService.checaToken, infracoesController.getInfracaoByUidMSK);
router.put('/infracao/:id', authService.checaToken, infracoesController.updateInfracao);
router.delete('/infracao/:id', authService.checaToken, infracoesController.deleteInfracao);

router.get('/dashboard-metrics', authService.checaToken, dashboardMetricsController.getDashboardMetrics);
router.get('/infracoes-chart-data', authService.checaToken, dashboardMetricsController.getInfracoesChartData);
router.get('/dashboard-metrics-colaborador-maior-aumento', authService.checaToken, dashboardMetricsController.getColaboradorMaiorAumento);
router.get('/top-offenders', authService.checaToken, dashboardMetricsController.getTopOffenders);
router.get('/veiculos-devolucao', authService.checaToken, dashboardMetricsController.getVeiculosContratoProximo);
router.get('/vencimento-multas', authService.checaToken, dashboardMetricsController.getMultasProximasVencer);

export default router;