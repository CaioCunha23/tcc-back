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


router.post('/colaborador', authService.checaToken, authService.pegarUsuarioDoToken, colaboradoresController.createWorker);
router.post('/colaboradores/import', authService.checaToken, authService.pegarUsuarioDoToken, upload.single('file'), colaboradoresController.importWorkerCSV);
router.get('/colaboradores', authService.checaToken, authService.pegarUsuarioDoToken, colaboradoresController.getWorkers);
router.get('/colaborador/:id', authService.checaToken, authService.pegarUsuarioDoToken, colaboradoresController.getWorkerById);
router.get('/colaborador/uid/:uidMSK', authService.checaToken, authService.pegarUsuarioDoToken, colaboradoresController.getWorkerByMskID);
router.put('/colaborador/:id', authService.checaToken, authService.pegarUsuarioDoToken, colaboradoresController.updateWorker);
router.delete('/colaborador/:id', authService.checaToken, authService.pegarUsuarioDoToken, colaboradoresController.deleteWorker);

router.post('/veiculo', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.createVehicle);
router.post('/veiculos/import', authService.checaToken, authService.pegarUsuarioDoToken, upload.single('file'), veiculosController.importVehicleCSV);
router.get('/veiculos', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.getVehicles);
router.get('/veiculo/:id', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.getVehicleByID);
router.get('/veiculo/:uidMSK', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.getVehicleByMskID);
router.get('/veiculo/:placa', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.getVehicleByPlate);
router.put('/veiculo/:id', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.updateVehicle);
router.delete('/veiculo/:id', authService.checaToken, authService.pegarUsuarioDoToken, veiculosController.deleteVehicle);

router.post('/historico', authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.createHistorico);
router.get('/historicos', authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.getHistoricos);
router.get('/historico/:id', authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.getHistoricoById);
router.put('/historico/:id', authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.updateHistorico);
router.delete('/historico/:id', authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.deleteHistorico);
router.post("/historico-utilizacao/iniciar", authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.startUse);
router.post("/historico-utilizacao/finalizar", authService.checaToken, authService.pegarUsuarioDoToken, historicoUtilizacaoVeiculosController.finishUse);

router.post('/infracao', authService.checaToken, authService.pegarUsuarioDoToken, infracoesController.createInfracao);
router.post('/infracoes/import', authService.checaToken, authService.pegarUsuarioDoToken, upload.single('file'), infracoesController.importInfractionCSV);
router.get('/infracoes', authService.checaToken, authService.pegarUsuarioDoToken, infracoesController.getInfracoes);
router.get('/infracao/:id', authService.checaToken, authService.pegarUsuarioDoToken, infracoesController.getInfracaoById);
router.get('/infracoes/:uidMSK', authService.checaToken, authService.pegarUsuarioDoToken, infracoesController.getInfracaoByUidMSK);
router.put('/infracao/:id', authService.checaToken, authService.pegarUsuarioDoToken, infracoesController.updateInfracao);
router.delete('/infracao/:id', authService.checaToken, authService.pegarUsuarioDoToken, infracoesController.deleteInfracao);

router.get('/dashboard-metrics', authService.checaToken, authService.pegarUsuarioDoToken, dashboardMetricsController.getDashboardMetrics);
router.get('/infracoes-chart-data', authService.checaToken, authService.pegarUsuarioDoToken, dashboardMetricsController.getInfracoesChartData);
router.get('/dashboard-metrics-colaborador-maior-aumento', authService.checaToken, authService.pegarUsuarioDoToken, dashboardMetricsController.getColaboradorMaiorAumento);
router.get('/top-offenders', authService.checaToken, authService.pegarUsuarioDoToken, dashboardMetricsController.getTopOffenders);
router.get('/veiculos-devolucao', authService.checaToken, authService.pegarUsuarioDoToken, dashboardMetricsController.getVeiculosContratoProximo);
router.get('/vencimento-multas', authService.checaToken, authService.pegarUsuarioDoToken, dashboardMetricsController.getMultasProximasVencer);

export default router;