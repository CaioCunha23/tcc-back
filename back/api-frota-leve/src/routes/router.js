import { Router } from 'express';

const router = Router();

import authService from '../services/authService.js';
import veiculosController from '../controllers/veiculosController.js';
import colaboradoresController from '../controllers/colaboradoresController.js';
import historicoUtilizacaoVeiculosController from '../controllers/historicoUtilizacaoVeiculosController.js'

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
router.post('/historicos', historicoUtilizacaoVeiculosController.getHistoricos);
router.post('/historico/:id', historicoUtilizacaoVeiculosController.getHistoricoById);
router.post('/historico/:id', historicoUtilizacaoVeiculosController.updateHistorico);
router.post('/historico/:id', historicoUtilizacaoVeiculosController.deleteHistorico);

export default router;