import HistoricoUtilizacaoVeiculo from '../models/HistoricoUtilizacaoVeiculo.js'
import Colaborador from '../models/Colaborador.js'
import Veiculo from '../models/Veiculo.js'

async function createHistorico(req, res) {
    const {
        colaboradorUid,
        veiculoId,
        dataInicio,
        dataFim,
        tipoUso
    } = req.body

    const historico = HistoricoUtilizacaoVeiculo.build({
        colaboradorUid,
        veiculoId,
        dataInicio,
        dataFim,
        tipoUso
    })

    try {
        await historico.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações do histórico inválidas: ' + error.message })
    }

    try {
        await historico.save()
        res.status(201).json(historico.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar histórico: ' + error.message })
    }
}

async function startUsoViaQr(req, res) {
    const { placa } = req.params;
    const uid = req.user?.uid || req.body.colaboradorUid;
    if (!uid) return res.status(400).json({ error: 'UID do colaborador é obrigatório' });

    try {
        const vehicle = await Veiculo.findOne({ where: { placa } });
        if (!vehicle) return res.status(404).json({ error: 'Veículo não encontrado' });

        const newTemporaryUse = await HistoricoUtilizacaoVeiculo.create({
            colaboradorUid: uid,
            veiculoId: vehicle.id,
            dataInicio: new Date(),
            dataFim: null,
            tipoUso: 'temporario'
        });
        res.status(201).json(newTemporaryUse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function endUsoViaQr(req, res) {
    const { placa } = req.params;
    try {
        const vehicle = await Veiculo.findOne({ where: { placa } });
        if (!vehicle) return res.status(404).json({ error: 'Veículo não encontrado' });

        const registro = await HistoricoUtilizacaoVeiculo.findOne({
            where: { veiculoId: vehicle.id, dataFim: null },
            order: [['dataInicio', 'DESC']]
        });
        if (!registro) return res.status(400).json({ error: 'Veículo não está em uso' });

        registro.dataFim = new Date();
        await registro.save();
        res.json(registro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getHistoricos(req, res) {
    try {
        const historicos = await HistoricoUtilizacaoVeiculo.findAll({
            include: [
                {
                    model: Colaborador,
                    attributes: ['nome', 'brand']
                },
                {
                    model: Veiculo,
                    attributes: ['placa', 'modelo', 'renavam', 'chassi', 'status']
                }
            ]
        });
        res.json(historicos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar históricos: ' + error.message });
    }
}

async function getHistoricoById(req, res) {
    const { id } = req.params;

    try {
        const historico = await HistoricoUtilizacaoVeiculo.findByPk(id, {
            include: [
                {
                    model: Colaborador,
                    attributes: ['nome', 'brand']
                },
                {
                    model: Veiculo,
                    attributes: ['placa', 'modelo', 'renavam', 'chassi', 'status']
                }
            ]
        });
        if (historico) {
            res.json(historico.toJSON());
        } else {
            res.status(404).json({ error: 'Histórico não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico: ' + error.message });
    }
}

async function updateHistorico(req, res) {
    const { id } = req.params
    const {
        colaboradorUid,
        veiculoId,
        dataInicio,
        dataFim,
        tipoUso
    } = req.body

    try {
        const historico = await HistoricoUtilizacaoVeiculo.findByPk(id)
        if (!historico) {
            return res.status(404).json({ error: 'Histórico não encontrado' })
        }

        if (colaboradorUid) historico.colaboradorUid = colaboradorUid
        if (veiculoId) historico.veiculoId = veiculoId
        if (dataInicio) historico.dataInicio = dataInicio
        if (dataFim !== undefined) historico.dataFim = dataFim
        if (tipoUso) historico.tipoUso = tipoUso

        try {
            await historico.validate()
        } catch (error) {
            return res.status(400).json({ error: 'Informações do histórico inválidas: ' + error.message })
        }

        try {
            await historico.save()
            res.json(historico.toJSON())
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar histórico: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico: ' + error.message })
    }
}

async function deleteHistorico(req, res) {
    const { id } = req.params

    try {
        const historico = await HistoricoUtilizacaoVeiculo.findByPk(id)
        if (!historico) {
            return res.status(404).json({ error: 'Histórico não encontrado' })
        }

        try {
            await historico.destroy()
            res.json({ message: 'Histórico excluído com sucesso' })
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir histórico: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico: ' + error.message })
    }
}

export default {
    createHistorico,
    startUsoViaQr,
    endUsoViaQr,
    getHistoricos,
    getHistoricoById,
    updateHistorico,
    deleteHistorico
}