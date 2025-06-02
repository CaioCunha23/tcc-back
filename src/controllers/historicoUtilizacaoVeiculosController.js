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
        console.log('=== DEBUG BACKEND START USE ===');
        console.log('StartUse chamado com req.body:', req.body);
        console.log('req.user:', req.user);
        console.log('req.headers.authorization:', req.headers.authorization);
        console.log('===============================');

        const { placa, modelo, renavam, chassi, status, colaboradorUid: uidNoBody } = req.body;

        console.log('=== VALORES EXTRAÍDOS ===');
        console.log('placa:', placa);
        console.log('modelo:', modelo);
        console.log('renavam:', renavam);
        console.log('chassi:', chassi);
        console.log('status:', status);
        console.log('colaboradorUid (uidNoBody):', uidNoBody);
        console.log('=========================');

        if (!placa || !modelo || !renavam || !chassi || !status) {
            console.log('❌ Dados do veículo incompletos');
            return res.status(400).json({
                error: "Dados do veículo incompletos. É necessário placa, modelo, renavam, chassi e status.",
            });
        }

        let colaboradorUid;

        console.log('=== VERIFICAÇÃO DE AUTENTICAÇÃO ===');
        if (req.user && req.user.uidMSK) {
            console.log('✅ Usuário autenticado via token, uidMSK:', req.user.uidMSK);
            colaboradorUid = req.user.uidMSK;
        } else {
            console.log('❌ Usuário não autenticado via token');
            if (!uidNoBody) {
                console.log('❌ uidNoBody também não existe, retornando erro 400');
                return res
                    .status(400)
                    .json({ error: "Usuário não autenticado. Envie colaboradorUid no body." });
            }
            console.log('✅ Usando uidNoBody:', uidNoBody);
            colaboradorUid = uidNoBody;
        }
        console.log('colaboradorUid final:', colaboradorUid);
        console.log('===================================');

        const colaborador = await Colaborador.findOne({
            where: { uidMSK: colaboradorUid },
        });
        
        console.log('=== BUSCA DO COLABORADOR ===');
        console.log('Colaborador encontrado:', !!colaborador);
        if (colaborador) {
            console.log('Dados do colaborador:', { id: colaborador.id, uidMSK: colaborador.uidMSK });
        }
        console.log('============================');
        
        if (!colaborador) {
            console.log('❌ Colaborador não existe');
            return res
                .status(404)
                .json({ error: `Colaborador com UID '${colaboradorUid}' não existe.` });
        }

        const veiculo = await Veiculo.findOne({ where: { placa } });
        console.log('=== BUSCA DO VEÍCULO ===');
        console.log('Veículo encontrado:', !!veiculo);
        if (veiculo) {
            console.log('Dados do veículo:', { id: veiculo.id, placa: veiculo.placa });
        }
        console.log('========================');
        
        if (!veiculo) {
            console.log('❌ Veículo não existe');
            return res
                .status(404)
                .json({ error: `Veículo de placa '${placa}' não foi encontrado.` });
        }

        // ✅ CORREÇÃO: Usar veiculoPlaca em vez de veiculoId
        const activeRegistro = await HistoricoUtilizacaoVeiculo.findOne({
            where: {
                veiculoPlaca: placa, // ✅ Mudança aqui
                dataFim: { [Op.is]: null },
            },
        });

        console.log('=== VERIFICAÇÃO DE USO ATIVO ===');
        console.log('Registro ativo encontrado:', !!activeRegistro);
        if (activeRegistro) {
            console.log('Dados do registro ativo:', {
                id: activeRegistro.id,
                colaboradorUid: activeRegistro.colaboradorUid,
                veiculoPlaca: activeRegistro.veiculoPlaca // ✅ Mudança aqui
            });
            console.log('Colaborador atual:', colaboradorUid);
            console.log('São o mesmo colaborador?', activeRegistro.colaboradorUid === colaboradorUid);
        }
        console.log('================================');

        if (activeRegistro) {
            if (activeRegistro.colaboradorUid === colaboradorUid) {
                console.log('✅ Mesmo colaborador, retornando action finish');
                return res.status(409).json({
                    error: "Você já está usando este veículo. Escaneie novamente para finalizar.",
                    action: "finish"
                });
            } else {
                console.log('❌ Colaborador diferente já está usando');
                return res.status(409).json({
                    error: "Este veículo já está em uso por outro colaborador.",
                });
            }
        }

        console.log('=== CRIANDO NOVO HISTÓRICO ===');
        // ✅ CORREÇÃO: Usar veiculoPlaca em vez de veiculoId
        const novoHistorico = await HistoricoUtilizacaoVeiculo.create({
            colaboradorUid,
            veiculoPlaca: placa, // ✅ Mudança aqui
            dataInicio: new Date(),
            dataFim: null,
            tipoUso: "temporario",
        });
        
        console.log('✅ Histórico criado:', {
            id: novoHistorico.id,
            colaboradorUid: novoHistorico.colaboradorUid,
            veiculoPlaca: novoHistorico.veiculoPlaca // ✅ Mudança aqui
        });
        console.log('==============================');

        return res.status(201).json({
            message: "Início de utilização registrado com sucesso.",
            historico: novoHistorico,
        });
    } catch (error) {
        console.error("❌ Erro em startUse:", error);
        return res
            .status(500)
            .json({ error: "Erro interno ao iniciar utilização: " + error.message });
    }
}

async function finishUse(req, res) {
    try {
        console.log('FinishUse chamado com:', req.body);

        const { placa, uidMSK: uidNoBody } = req.body;

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
                .json({ error: "Usuário não autenticado. Envie uidMSK no body." });
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