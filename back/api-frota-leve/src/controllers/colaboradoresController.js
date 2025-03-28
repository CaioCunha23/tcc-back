import Colaborador from '../models/Colaborador.js'
import Veiculo from '../models/Veiculo.js'

async function createWorker(req, res) {
    const {
        nome,
        status,
        email,
        uidMSK,
        password,
        type,
        localidade,
        brand,
        jobTitle,
        cpf,
        usaEstacionamento,
        cidadeEstacionamento,
        cnh,
        tipoCNH
    } = req.body

    const worker = Colaborador.build({
        nome,
        status,
        email,
        uidMSK,
        password,
        type,
        localidade,
        brand,
        jobTitle,
        cpf,
        usaEstacionamento,
        cidadeEstacionamento,
        cnh,
        tipoCNH
    })

    try {
        await worker.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações do colaborador inválidas: ' + error.message })
    }

    try {
        await worker.save()
        res.status(201).json(worker.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar colaborador: ' + error.message })
    }
}

async function getWorkers(req, res) {
    try {
        const workers = await Colaborador.findAll({
            include: {
                model: Veiculo,
                attributes: ['placa'],
            },
        })
        res.json(workers)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar colaboradores: ' + error.message })
    }
}

async function getWorkerById(req, res) {
    const { id } = req.params

    try {
        const worker = await Colaborador.findByPk(id)
        if (worker) {
            res.json(worker.toJSON())
        } else {
            res.status(404).json({ error: 'Colaborador não encontrado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar colaborador: ' + error.message })
    }
}

async function getWorkerByMskID(req, res) {
    const { uidMSK } = req.params

    try {
        const worker = await Colaborador.findOne({ where: { uidMSK } })
        if (worker) {
            res.json(worker.toJSON())
        } else {
            res.status(404).json({ error: 'Colaborador não encontrado pelo UID MSK informado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar colaborador: ' + error.message })
    }
}

async function updateWorker(req, res) {
    const { id } = req.params
    const {
        nome,
        status,
        email,
        uidMSK,
        password,
        type,
        localidade,
        brand,
        jobTitle,
        cpf,
        usaEstacionamento,
        cidadeEstacionamento,
        cnh,
        tipoCNH
    } = req.body

    try {
        const worker = await Colaborador.findByPk(id)
        if (!worker) {
            return res.status(404).json({ error: 'Colaborador não encontrado' })
        }

        if (nome) worker.nome = nome
        if (status) worker.status = status
        if (email) worker.email = email
        if (uidMSK) worker.uidMSK = uidMSK
        if (password) worker.password = password
        if (type) worker.type = type
        if (localidade) worker.localidade = localidade
        if (brand) worker.brand = brand
        if (jobTitle) worker.jobTitle = jobTitle
        if (cpf) worker.cpf = cpf
        if (usaEstacionamento !== undefined) worker.usaEstacionamento = usaEstacionamento
        if (cidadeEstacionamento !== undefined) worker.cidadeEstacionamento = cidadeEstacionamento
        if (cnh) worker.cnh = cnh
        if (tipoCNH) worker.tipoCNH = tipoCNH

        try {
            await worker.validate()
        } catch (error) {
            return res.status(400).json({ error: 'Informações do colaborador inválidas: ' + error.message })
        }

        try {
            await worker.save()
            res.json(worker.toJSON())
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar colaborador: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar colaborador: ' + error.message })
    }
}

async function deleteWorker(req, res) {
    const { id } = req.params

    try {
        const worker = await Colaborador.findByPk(id)
        if (!worker) {
            return res.status(404).json({ error: 'Colaborador não encontrado' })
        }

        try {
            await worker.destroy()
            res.json({ message: 'Colaborador excluído com sucesso' })
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir colaborador: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar colaborador: ' + error.message })
    }
}

export default {
    createWorker,
    getWorkers,
    getWorkerById,
    getWorkerByMskID,
    updateWorker,
    deleteWorker
}