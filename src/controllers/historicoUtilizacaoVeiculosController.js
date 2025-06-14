import { Op } from 'sequelize' // ADICIONADO: Import do Op
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

async function startUse(req, res) {
    try {
        const { placa, modelo, renavam, chassi, status, colaboradorUid: uidNoBody } = req.body;

        if (!placa || !modelo || !renavam || !chassi || !status) {
            return res.status(400).json({
                error: "Dados do veículo incompletos. É necessário placa, modelo, renavam, chassi e status.",
            });
        }

        let colaboradorUid;

        if (req.user && req.user.uidMSK) {
            colaboradorUid = req.user.uidMSK;
        } else {
            if (!uidNoBody) {
                return res
                    .status(400)
                    .json({ error: "Usuário não autenticado. Envie colaboradorUid no body." });
            }
            colaboradorUid = uidNoBody;
        }

        const colaborador = await Colaborador.findOne({
            where: { uidMSK: colaboradorUid },
        });

        if (colaborador) {
            console.log('Dados do colaborador:', { id: colaborador.id, uidMSK: colaborador.uidMSK });
        }

        if (!colaborador) {
            console.log('Colaborador não existe');
            return res
                .status(404)
                .json({ error: `Colaborador com UID '${colaboradorUid}' não existe.` });
        }

        const veiculo = await Veiculo.findOne({ where: { placa } });

        if (veiculo) {
            console.log('Dados do veículo:', { id: veiculo.id, placa: veiculo.placa });
        }

        if (!veiculo) {
            console.log('Veículo não existe');
            return res
                .status(404)
                .json({ error: `Veículo de placa '${placa}' não foi encontrado.` });
        }

        const activeRegistro = await HistoricoUtilizacaoVeiculo.findOne({
            where: {
                veiculoPlaca: placa,
                dataFim: { [Op.is]: null },
            },
        });

        if (activeRegistro) {
            console.log('Dados do registro ativo:', {
                id: activeRegistro.id,
                colaboradorUid: activeRegistro.colaboradorUid,
                veiculoPlaca: activeRegistro.veiculoPlaca
            });
            console.log('Colaborador atual:', colaboradorUid);
            console.log('São o mesmo colaborador?', activeRegistro.colaboradorUid === colaboradorUid);
        }

        if (activeRegistro) {
            if (activeRegistro.colaboradorUid === colaboradorUid) {
                console.log('Mesmo colaborador, retornando action finish');
                return res.status(409).json({
                    error: "Você já está usando este veículo. Escaneie novamente para finalizar.",
                    action: "finish"
                });
            } else {
                console.log('Colaborador diferente já está usando');
                return res.status(409).json({
                    error: "Este veículo já está em uso por outro colaborador.",
                });
            }
        }

        const novoHistorico = await HistoricoUtilizacaoVeiculo.create({
            colaboradorUid,
            veiculoPlaca: placa,
            dataInicio: new Date(),
            dataFim: null,
            tipoUso: "temporario",
        });

        await veiculo.update({
            status: "Em Uso"
        });

        return res.status(201).json({
            message: "Início de utilização registrado com sucesso.",
            historico: novoHistorico,
        });
    } catch (error) {
        console.error("Erro em startUse:", error);
        return res
            .status(500)
            .json({ error: "Erro interno ao iniciar utilização: " + error.message });
    }
}

async function finishUse(req, res) {
    try {
        const { placa, colaboradorUid: uidNoBody } = req.body;

        if (!placa) {
            return res
                .status(400)
                .json({ error: "É necessário enviar a placa do veículo para finalizar uso." });
        }

        let colaboradorUid;

        if (req.user && req.user.uidMSK) {
            colaboradorUid = req.user.uidMSK;
        } else if (uidNoBody) {
            colaboradorUid = uidNoBody;
        } else {
            return res
                .status(400)
                .json({ error: "Usuário não autenticado. Envie colaboradorUid no body." });
        }

        const colaborador = await Colaborador.findOne({
            where: { uidMSK: colaboradorUid },
        });

        if (!colaborador) {
            return res
                .status(404)
                .json({ error: `Colaborador com UID '${colaboradorUid}' não existe.` });
        }

        const veiculo = await Veiculo.findOne({ where: { placa } });
        if (!veiculo) {
            return res
                .status(404)
                .json({ error: `Veículo de placa '${placa}' não foi encontrado.` });
        }

        const activeRegistro = await HistoricoUtilizacaoVeiculo.findOne({
            where: {
                veiculoPlaca: veiculo.placa,
                dataFim: { [Op.is]: null },
            },
        });

        if (!activeRegistro) {
            return res.status(404).json({
                error: "Não existe utilização ativa para este veículo.",
            });
        }

        if (activeRegistro.colaboradorUid !== colaboradorUid) {
            return res.status(403).json({
                error: "Você não pode finalizar a utilização de um veículo iniciado por outro colaborador.",
            });
        }

        activeRegistro.dataFim = new Date();
        await activeRegistro.save();

        if (veiculo) {
            await veiculo.update({
                status: "Disponível"
            });
        }

        return res.status(200).json({
            message: "Utilização finalizada com sucesso.",
            historico: activeRegistro,
        });
    } catch (error) {
        console.error("Erro em finishUse:", error);
        return res
            .status(500)
            .json({ error: "Erro interno ao finalizar utilização: " + error.message });
    }
}

export default {
    createHistorico,
    getHistoricos,
    getHistoricoById,
    updateHistorico,
    deleteHistorico,
    startUse,
    finishUse
}