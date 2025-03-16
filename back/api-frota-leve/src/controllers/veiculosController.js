import Veiculo from '../models/Veiculo.js'

async function createVehicle(req, res) {
    const {
        fornecedor,
        contrato,
        placa,
        renavan,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        uidMSK,
        perfil,
        jobLevel,
        descricaoCargo,
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
        renavan,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        uidMSK,
        perfil,
        jobLevel,
        descricaoCargo,
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

async function getVehicles(req, res) {
    try {
        const vehicles = await Veiculo.findAll()
        res.json(vehicles)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículos: ' + error.message })
    }
}

async function getVehicleByMskID(req, res) {
    const { uidMSK } = req.params

    try {
        const vehicles = await Veiculo.findAll({ where: { uidMSK } })
        if (vehicles && vehicles.length > 0) {
            res.json(vehicles)
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
        renavan,
        chassi,
        modelo,
        cor,
        status,
        cliente,
        uidMSK,
        perfil,
        jobLevel,
        descricaoCargo,
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
        if (renavan) vehicle.renavan = renavan
        if (chassi) vehicle.chassi = chassi
        if (modelo) vehicle.modelo = modelo
        if (cor) vehicle.cor = cor
        if (status) vehicle.status = status
        if (cliente) vehicle.cliente = cliente
        if (uidMSK) vehicle.uidMSK = uidMSK
        if (perfil) vehicle.perfil = perfil
        if (jobLevel) vehicle.jobLevel = jobLevel
        if (descricaoCargo) vehicle.descricaoCargo = descricaoCargo
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
    getVehicles,
    getVehicleByMskID,
    getVehicleByPlate,
    updateVehicle,
    deleteVehicle
}