import { Router } from 'express';

const router = Router();

import authService from '../services/authService.js';
import usuariosController from '../controllers/usuariosController.js';
import veiculosController from '../controllers/veiculosController.js';
import colaboradoresController from '../controllers/colaboradoresController.js';

router.post('/login', authService.login);
router.post('/eu', authService.pegarUsuarioDoToken);

router.post('/usuario', usuariosController.createUser);
router.get('/usuarios', usuariosController.getUsers);
router.get('/usuario/:uidMSK', authService.checaToken, usuariosController.getUserByMskID);
router.put('/usuario/:uidMSK', usuariosController.updateUser);
router.delete('/usuario/:uidMSK', authService.checaToken, usuariosController.deleteUser);

router.post('/veiculo', veiculosController.createVehicle);
router.get('/veiculos', veiculosController.getVehicles);
router.get('/veiculo/:id', veiculosController.getVehicleByID);
router.get('/veiculo/:uidMSK', veiculosController.getVehicleByMskID);
router.get('/veiculo/:placa', veiculosController.getVehicleByPlate);
router.put('/veiculo/:id', veiculosController.updateVehicle);
router.delete('/veiculo/:id', veiculosController.deleteVehicle);

router.post('/colaborador', colaboradoresController.createWorker);
router.get('/colaboradores', colaboradoresController.getWorkers);
router.get('/colaborador/:id', colaboradoresController.getWorkerById);
router.get('/colaborador/:uidMSK', colaboradoresController.getWorkerByMskID);
router.put('/colaborador/:id', colaboradoresController.updateWorker);
router.delete('/colaborador/:id', colaboradoresController.deleteWorker);

export default router;