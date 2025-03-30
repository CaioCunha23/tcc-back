import { Router } from 'express';

const router = Router();

import authService from '../services/authService.js';
import veiculosController from '../controllers/veiculosController.js';
import colaboradoresController from '../controllers/colaboradoresController.js';
import historicoUtilizacaoVeiculosController from '../controllers/historicoUtilizacaoVeiculosController.js';
import infracoesController from '../controllers/infracoesController.js';

router.post('/login', authService.login);
router.post('/eu', authService.pegarUsuarioDoToken);

router.post('/colaborador', colaboradoresController.createWorker);
router.get('/colaboradores', colaboradoresController.getWorkers);
router.get('/colaborador/:id', colaboradoresController.getWorkerById);
router.get('/colaborador/:uidMSK', colaboradoresController.getWorkerByMskID);
router.put('/colaborador/:id', colaboradoresController.updateWorker);
router.delete('/colaborador/:id', colaboradoresController.deleteWorker);

router.post('/veiculo', veiculosController.createVehicle);
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

router.post('/infracao', infracoesController.createInfracao);
router.get('/infracoes', infracoesController.getInfracoes);
router.get('/infracao/:id', infracoesController.getInfracaoById);
router.put('/infracao/:id', infracoesController.updateInfracao);
router.delete('/infracao/:id', infracoesController.deleteInfracao);

export default router;