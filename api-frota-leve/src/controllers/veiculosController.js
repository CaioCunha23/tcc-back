import Veiculo from '../models/Veiculo.js';
import * as csv from 'csv';
import fs from 'fs';
import path from 'path';

async function createVehicle(req, res) {
    const {
        fornecedor,
        contrato,
        placa,
        renavam,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        perfil,
        centroCusto,
        franquiaKM,
        carroReserva,
        dataDisponibilizacao,
        mesesContratados,
        previsaoDevolucao,
        mesesFaltantes,
        mensalidade,
        budget,
        multa,
        proximaRevisao
    } = req.body

    const vehicle = Veiculo.build({
        fornecedor,
        contrato,
        placa,
        renavam,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        perfil,
        centroCusto,
        franquiaKM,
        carroReserva,
        dataDisponibilizacao,
        mesesContratados,
        previsaoDevolucao,
        mesesFaltantes,
        mensalidade,
        budget,
        multa,
        proximaRevisao
    })

    try {
        await vehicle.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de veículo inválidas: ' + error.message })
    }

    try {
        await vehicle.save()
        res.status(201).json(vehicle.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar veículo: ' + error.message })
    }
}

async function createVehicleFromCSV(vehicleData) {
    const {
        fornecedor,
        contrato,
        placa,
        renavam,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        perfil,
        centroCusto,
        franquiaKM,
        carroReserva,
        dataDisponibilizacao,
        mesesContratados,
        previsaoDevolucao,
        mesesFaltantes,
        mensalidade,
        budget,
        multa,
        proximaRevisao
    } = vehicleData;

    if (
        !fornecedor ||
        !contrato ||
        !placa ||
        !renavam ||
        !chassi ||
        !modelo ||
        !cor ||
        !status ||
        !cliente ||
        !perfil ||
        !centroCusto ||
        !franquiaKM ||
        !carroReserva ||
        !dataDisponibilizacao ||
        !mesesContratados ||
        !previsaoDevolucao ||
        !mesesFaltantes ||
        !mensalidade ||
        !budget ||
        !multa ||
        !proximaRevisao) {
        console.log("Campos obrigatórios faltando.");
    }

    try {
        const vehicle = await Veiculo.create({
            fornecedor,
            contrato,
            placa,
            renavam,
            chassi,
            modelo,
            cor,
            status,
            cliente,
            perfil,
            centroCusto,
            franquiaKM,
            carroReserva,
            dataDisponibilizacao,
            mesesContratados,
            previsaoDevolucao,
            mesesFaltantes,
            mensalidade,
            budget,
            multa,
            proximaRevisao
        });
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
    }
}

async function importVehicleCSV(req, res) {
    console.log("Arquivo recebido pelo Multer:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "Arquivo CSV não enviado." });
    }

    const filePath = path.resolve(req.file.path);
    const vehicles = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv.parse({ columns: true, trim: true, delimiter: ';' }))
                .on('data', (row) => {
                    console.log("Linha lida:", row);
                    vehicles.push(row);
                })
                .on('end', () => {
                    console.log("Final do processamento do CSV. Total de linhas:", vehicles.length);
                    resolve();
                })
                .on('error', (error) => {
                    console.error("Erro ao ler o CSV:", error);
                    reject(error);
                });
        });

        for (const vehicleData of vehicles) {
            try {
                await createWorkerFromCSV(vehicleData);
                console.log("Veículo criado:", vehicleData);
            } catch (e) {
                console.error("Erro ao criar veículo:", vehicleData, e);
            }
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao remover o arquivo CSV:", err);
            }
        });
        return res.status(201).json({ message: "Veículos importados com sucesso!", total: vehicles.length });
    } catch (error) {
        console.error("Erro ao processar o CSV:", error);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao remover o arquivo CSV após erro:", err);
            }
        });
        return res.status(500).json({ error: "Erro ao importar veículos: " + error.message });
    }
}

async function getVehicles(req, res) {
    try {
        const vehicles = await Veiculo.findAll()
        res.json(vehicles)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículos: ' + error.message })
    }
}

async function getVehicleByID(req, res) {
    const { id } = req.params

    try {
        const vehicle = await Veiculo.findByPk(id)
        if (vehicle) {
            res.json(vehicle.toJSON())
        } else {
            res.status(404).json({ error: 'Nenhum veículo encontrado para o ID informado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo: ' + error.message })
    }
}

async function getVehicleByMskID(req, res) {
    const { uidMSK } = req.params

    try {
        const vehicle = await Veiculo.findByPk(uidMSK)
        if (vehicle) {
            res.json(vehicle.toJSON())
        } else {
            res.status(404).json({ error: 'Nenhum veículo encontrado para o UID MSK informado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo: ' + error.message })
    }
}

async function getVehicleByPlate(req, res) {
    const { placa } = req.params

    try {
        const vehicle = await Veiculo.findOne({ where: { placa } })
        if (vehicle) {
            res.json(vehicle.toJSON())
        } else {
            res.status(404).json({ error: 'Veículo não encontrado pela placa informada' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo: ' + error.message })
    }
}

async function updateVehicle(req, res) {
    const { id } = req.params
    const {
        fornecedor,
        contrato,
        placa,
        renavam,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        perfil,
        centroCusto,
        franquiaKM,
        carroReserva,
        dataDisponibilizacao,
        mesesContratados,
        previsaoDevolucao,
        mesesFaltantes,
        mensalidade,
        budget,
        multa,
        proximaRevisao
    } = req.body

    try {
        const vehicle = await Veiculo.findByPk(id)
        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado' })
        }

        if (fornecedor) vehicle.fornecedor = fornecedor
        if (contrato) vehicle.contrato = contrato
        if (placa) vehicle.placa = placa
        if (renavam) vehicle.renavam = renavam
        if (chassi) vehicle.chassi = chassi
        if (modelo) vehicle.modelo = modelo
        if (cor) vehicle.cor = cor
        if (status) vehicle.status = status
        if (cliente) vehicle.cliente = cliente
        if (perfil) vehicle.perfil = perfil
        if (centroCusto) vehicle.centroCusto = centroCusto
        if (franquiaKM !== undefined) vehicle.franquiaKM = franquiaKM
        if (carroReserva !== undefined) vehicle.carroReserva = carroReserva
        if (dataDisponibilizacao) vehicle.dataDisponibilizacao = dataDisponibilizacao
        if (mesesContratados !== undefined) vehicle.mesesContratados = mesesContratados
        if (previsaoDevolucao) vehicle.previsaoDevolucao = previsaoDevolucao
        if (mesesFaltantes !== undefined) vehicle.mesesFaltantes = mesesFaltantes
        if (mensalidade !== undefined) vehicle.mensalidade = mensalidade
        if (budget !== undefined) vehicle.budget = budget
        if (multa !== undefined) vehicle.multa = multa
        if (proximaRevisao) vehicle.proximaRevisao = proximaRevisao

        try {
            await vehicle.validate()
        } catch (error) {
            return res.status(400).json({ error: 'Informações de veículo inválidas: ' + error.message })
        }

        try {
            await vehicle.save()
            res.json(vehicle.toJSON())
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar veículo: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo: ' + error.message })
    }
}

async function deleteVehicle(req, res) {
    const { id } = req.params

    try {
        const vehicle = await Veiculo.findByPk(id)
        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado' })
        }

        try {
            await vehicle.destroy()
            res.json({ message: 'Veículo excluído com sucesso' })
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir veículo: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo: ' + error.message })
    }
}

export default {
    createVehicle,
    createVehicleFromCSV,
    importVehicleCSV,
    getVehicles,
    getVehicleByID,
    getVehicleByMskID,
    getVehicleByPlate,
    updateVehicle,
    deleteVehicle
}