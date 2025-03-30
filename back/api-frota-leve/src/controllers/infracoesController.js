import Infracao from '../models/Infracao.js'

async function createInfracao(req, res) {
    const {
        tipo,
        placa,
        colaboradorUid,
        veiculoId,
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
        valorMulta,
        codigoMulta,
        indicacaoLimite,
        statusResposta,
        reconhecimento,
        enviadoParaRH
    } = req.body

    const infracao = Infracao.build({
        tipo,
        placa,
        colaboradorUid,
        veiculoId,
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
        valorMulta,
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

async function updateInfracao(req, res) {
    const { id } = req.params
    const {
        tipo,
        placa,
        colaboradorUid,
        veiculoId,
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
        valorMulta,
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
        if (placa) infracao.placa = placa
        if (colaboradorUid) infracao.colaboradorUid = colaboradorUid
        if (veiculoId !== undefined) infracao.veiculoId = veiculoId
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
        if (valorMulta !== undefined) infracao.valorMulta = valorMulta
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
    getInfracoes,
    getInfracaoById,
    updateInfracao,
    deleteInfracao
}