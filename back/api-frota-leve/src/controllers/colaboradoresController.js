import Colaborador from '../models/Colaborador.js';
import Infracao from '../models/Infracao.js';
import * as csv from 'csv';
import fs from 'fs';
import path from 'path';

async function createWorker(req, res) {
    console.log("Recebido no backend:", req.body);

    const {
        nome, status, email, uidMSK, password, type,
        localidade, brand, jobTitle, cpf, usaEstacionamento,
        cidadeEstacionamento, cnh, tipoCNH
    } = req.body;

    if (!nome || !email || !uidMSK || !cpf || !cnh || !tipoCNH || !localidade || !brand || !jobTitle) {
        return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    try {
        const worker = await Colaborador.create({
            nome, status, email, uidMSK, password, type,
            localidade, brand, jobTitle, cpf, usaEstacionamento,
            cidadeEstacionamento, cnh, tipoCNH
        });
        res.status(201).json(worker);
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
        res.status(500).json({ error: "Erro ao criar colaborador: " + error.message });
    }
}

async function createWorkerFromCSV(collaboratorData) {
    const { nome, email, uidMSK, password, type, localidade, brand, jobTitle, cpf, usaEstacionamento, cidadeEstacionamento, cnh, tipoCNH } = collaboratorData;

    if (!nome || !email || !uidMSK || !cpf || !cnh || !tipoCNH || !localidade || !brand || !jobTitle) {
        console.log("Campos obrigatórios faltando.");
    }

    try {
        const worker = await Colaborador.create({
            nome, email, uidMSK, password, type,
            localidade, brand, jobTitle, cpf, usaEstacionamento,
            cidadeEstacionamento, cnh, tipoCNH
        });
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
    }
}

async function importWorkerCSV(req, res) {
    console.log("Arquivo recebido pelo Multer:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "Arquivo CSV não enviado." });
    }

    const filePath = path.resolve(req.file.path);
    const collaborators = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv.parse({ columns: true, trim: true, delimiter: ';' }))
                .on('data', (row) => {
                    console.log("Linha lida:", row);
                    collaborators.push(row);
                })
                .on('end', () => {
                    console.log("Final do processamento do CSV. Total de linhas:", collaborators.length);
                    resolve();
                })
                .on('error', (error) => {
                    console.error("Erro ao ler o CSV:", error);
                    reject(error);
                });
        });

        for (const collaboratorData of collaborators) {
            try {
                await createWorkerFromCSV(collaboratorData);
                console.log("Colaborador criado:", collaboratorData);
            } catch (e) {
                console.error("Erro ao criar colaborador:", collaboratorData, e);
            }
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao remover o arquivo CSV:", err);
            }
        });
        return res.status(201).json({ message: "Colaboradores importados com sucesso!", total: collaborators.length });
    } catch (error) {
        console.error("Erro ao processar o CSV:", error);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao remover o arquivo CSV após erro:", err);
            }
        });
        return res.status(500).json({ error: "Erro ao importar colaboradores: " + error.message });
    }
}

async function getWorkers(req, res) {
    try {
        const workers = await Colaborador.findAll({
            include: [{
                model: Infracao,
                attributes: ['valor']
            }]
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
        if (status !== undefined) worker.status = status
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
    createWorkerFromCSV,
    importWorkerCSV,
    getWorkers,
    getWorkerById,
    getWorkerByMskID,
    updateWorker,
    deleteWorker
}