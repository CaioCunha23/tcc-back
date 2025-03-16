import { Router } from 'express';

const router = Router();

import authService from '../services/authService.js';
import usuariosController from '../controllers/usuariosController.js';
import veiculosController from '../controllers/veiculosController.js';
import colaboradoresController from '../controllers/colaboradoresController.js';

router.post('/login', authService.login);
router.post('/eu', authService.pegarUsuarioDoToken);

router.post('/usuarios', usuariosController.createUser);
router.get('/usuarios', usuariosController.getUsers);
router.get('/usuarios/:uidMSK', authService.checaToken, usuariosController.getUserByMskID);
router.put('/usuarios/:uidMSK', usuariosController.updateUser);
router.delete('/usuarios/:uidMSK', authService.checaToken, usuariosController.deleteUser);

router.post('/veiculos', veiculosController.createVehicle);
router.get('/veiculos', veiculosController.getVehicles);
router.get('/veiculos/msk/:uidMSK', veiculosController.getVehicleByMskID);
router.get('/veiculos/placa/:placa', veiculosController.getVehicleByPlate);
router.put('/veiculos/:id', veiculosController.updateVehicle);
router.delete('/veiculos/:id', veiculosController.deleteVehicle);

router.post('/colaboradores', colaboradoresController.createWorker);
router.get('/colaboradores', colaboradoresController.getWorkers);
router.get('/colaboradores/id/:id', colaboradoresController.getWorkerById);
router.get('/colaboradores/msk/:uidMSK', colaboradoresController.getWorkerByMskID);
router.put('/colaboradores/:id', colaboradoresController.updateWorker);
router.delete('/colaboradores/:id', colaboradoresController.deleteWorker);

export default router;