import Infracao from '../models/Infracao.js';
import * as csv from 'csv';
import fs from 'fs';
import path from 'path';

async function createInfracao(req, res) {
    const {
        tipo,
        colaboradorUid,
        placaVeiculo,
        costCenter,
        dataInfracao,
        tag,
        hora,
        valor,
        prefixo,
        marca,
        categoria,
        rodovia,
        praca,
        nome,
        dataEnvio,
        codigoMulta,
        indicacaoLimite,
        statusResposta,
        reconhecimento,
        enviadoParaRH
    } = req.body

    if (
        !tipo ||
        !colaboradorUid ||
        !placaVeiculo ||
        !costCenter ||
        !dataInfracao ||
        !tag ||
        !hora ||
        !valor ||
        !prefixo ||
        !marca ||
        !categoria ||
        !rodovia ||
        !praca ||
        !nome ||
        !dataEnvio ||
        !codigoMulta ||
        !indicacaoLimite ||
        !statusResposta ||
        !reconhecimento ||
        !enviadoParaRH
    ) {
        return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const infracao = Infracao.build({
        tipo,
        colaboradorUid,
        placaVeiculo,
        costCenter,
        dataInfracao,
        tag,
        hora,
        valor,
        prefixo,
        marca,
        categoria,
        rodovia,
        praca,
        nome,
        dataEnvio,
        codigoMulta,
        indicacaoLimite,
        statusResposta,
        reconhecimento,
        enviadoParaRH
    })

    try {
        await infracao.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações da infração inválidas: ' + error.message })
    }

    try {
        await infracao.save()
        res.status(201).json(infracao.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar infração: ' + error.message })
    }
}

async function createInfractionFromCSV(infractionData) {
    const {
        tipo,
        colaboradorUid,
        placaVeiculo,
        costCenter,
        dataInfracao,
        tag,
        hora,
        valor,
        prefixo,
        marca,
        categoria,
        rodovia,
        praca,
        nome,
        dataEnvio,
        codigoMulta,
        indicacaoLimite,
        statusResposta,
        reconhecimento,
        enviadoParaRH
    } = infractionData;

    if (
        !tipo ||
        !colaboradorUid ||
        !placaVeiculo ||
        !costCenter ||
        !dataInfracao ||
        !tag ||
        !hora ||
        !valor ||
        !prefixo ||
        !marca ||
        !categoria ||
        !rodovia ||
        !praca ||
        !nome ||
        !dataEnvio ||
        !codigoMulta ||
        !indicacaoLimite ||
        !statusResposta ||
        !reconhecimento ||
        !enviadoParaRH
    ) {
        console.log("Campos obrigatórios faltando.");
    }

    try {
        const infraction = await Infracao.create({
            tipo,
            colaboradorUid,
            placaVeiculo,
            costCenter,
            dataInfracao,
            tag,
            hora,
            valor,
            prefixo,
            marca,
            categoria,
            rodovia,
            praca,
            nome,
            dataEnvio,
            codigoMulta,
            indicacaoLimite,
            statusResposta,
            reconhecimento,
            enviadoParaRH
        });
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
    }
}

async function importInfractionCSV(req, res) {
    console.log("Arquivo recebido pelo Multer:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "Arquivo CSV não enviado." });
    }

    const filePath = path.resolve(req.file.path);
    const infractions = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv.parse({ columns: true, trim: true, delimiter: ';' }))
                .on('data', (row) => {
                    console.log("Linha lida:", row);
                    infractions.push(row);
                })
                .on('end', () => {
                    console.log("Final do processamento do CSV. Total de linhas:", infractions.length);
                    resolve();
                })
                .on('error', (error) => {
                    console.error("Erro ao ler o CSV:", error);
                    reject(error);
                });
        });

        for (const infractionData of infractions) {
            try {
                await createWorkerFromCSV(infractionData);
                console.log("Infração criada:", infractionData);
            } catch (e) {
                console.error("Erro ao criar infração:", infractionData, e);
            }
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao remover o arquivo CSV:", err);
            }
        });
        return res.status(201).json({ message: "Infrações importadas com sucesso!", total: infractions.length });
    } catch (error) {
        console.error("Erro ao processar o CSV:", error);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao remover o arquivo CSV após erro:", err);
            }
        });
        return res.status(500).json({ error: "Erro ao importar infrações: " + error.message });
    }
}

async function getInfracoes(req, res) {
    try {
        const infracoes = await Infracao.findAll()
        res.json(infracoes)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar infrações: ' + error.message })
    }
}

async function getInfracaoById(req, res) {
    const { id } = req.params

    try {
        const infracao = await Infracao.findByPk(id)
        if (infracao) {
            res.json(infracao.toJSON())
        } else {
            res.status(404).json({ error: 'Infração não encontrada' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar infração: ' + error.message })
    }
}

export async function getInfracaoByUidMSK(req, res) {
    const { uidMSK } = req.params;
    const { last30 } = req.query;

    try {
        let infractions = await Infracao.findAll({
            where: { colaboradorUid: uidMSK },
        });

        if (last30 === "true") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            infractions = infractions.filter(infraction =>
                new Date(infraction.dataInfracao) >= thirtyDaysAgo
            );
        }

        return res.json(infractions);
    } catch (error) {
        console.error("Erro ao buscar infrações:", error);
        return res.status(500).json({ error: "Erro ao buscar infrações" });
    }
}

async function updateInfracao(req, res) {
    const { id } = req.params
    const {
        tipo,
        colaboradorUid,
        placaVeiculo,
        costCenter,
        dataInfracao,
        tag,
        hora,
        valor,
        prefixo,
        marca,
        categoria,
        rodovia,
        praca,
        nome,
        dataEnvio,
        codigoMulta,
        indicacaoLimite,
        statusResposta,
        reconhecimento,
        enviadoParaRH
    } = req.body

    try {
        const infracao = await Infracao.findByPk(id)
        if (!infracao) {
            return res.status(404).json({ error: 'Infração não encontrada' })
        }

        if (tipo) infracao.tipo = tipo
        if (colaboradorUid) infracao.colaboradorUid = colaboradorUid
        if (placaVeiculo !== undefined) infracao.placaVeiculo = placaVeiculo
        if (costCenter) infracao.costCenter = costCenter
        if (dataInfracao) infracao.dataInfracao = dataInfracao
        if (tag !== undefined) infracao.tag = tag
        if (hora !== undefined) infracao.hora = hora
        if (valor !== undefined) infracao.valor = valor
        if (prefixo !== undefined) infracao.prefixo = prefixo
        if (marca !== undefined) infracao.marca = marca
        if (categoria !== undefined) infracao.categoria = categoria
        if (rodovia !== undefined) infracao.rodovia = rodovia
        if (praca !== undefined) infracao.praca = praca
        if (nome !== undefined) infracao.nome = nome
        if (dataEnvio !== undefined) infracao.dataEnvio = dataEnvio
        if (codigoMulta !== undefined) infracao.codigoMulta = codigoMulta
        if (indicacaoLimite !== undefined) infracao.indicacaoLimite = indicacaoLimite
        if (statusResposta !== undefined) infracao.statusResposta = statusResposta
        if (reconhecimento !== undefined) infracao.reconhecimento = reconhecimento
        if (enviadoParaRH !== undefined) infracao.enviadoParaRH = enviadoParaRH

        try {
            await infracao.validate()
        } catch (error) {
            return res.status(400).json({ error: 'Informações da infração inválidas: ' + error.message })
        }

        try {
            await infracao.save()
            res.json(infracao.toJSON())
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar infração: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar infração: ' + error.message })
    }
}

async function deleteInfracao(req, res) {
    const { id } = req.params

    try {
        const infracao = await Infracao.findByPk(id)
        if (!infracao) {
            return res.status(404).json({ error: 'Infração não encontrada' })
        }

        try {
            await infracao.destroy()
            res.json({ message: 'Infração excluída com sucesso' })
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir infração: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar infração: ' + error.message })
    }
}

export default {
    createInfracao,
    createInfractionFromCSV,
    importInfractionCSV,
    getInfracoes,
    getInfracaoById,
    getInfracaoByUidMSK,
    updateInfracao,
    deleteInfracao
}