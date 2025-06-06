import Colaborador from '../models/Colaborador.js';
import Infracao from '../models/Infracao.js';
import HistoricoUtilizacaoVeiculo from '../models/HistoricoUtilizacaoVeiculo.js';
import Veiculo from '../models/Veiculo.js';
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
    console.log("🔍 DEBUG - Dados recebidos no createWorkerFromCSV:", collaboratorData);

    const {
        nome, email, uidMSK, password, type, localidade, brand,
        jobTitle, cpf, usaEstacionamento, cidadeEstacionamento, cnh, tipoCNH
    } = collaboratorData;

    const camposObrigatorios = { nome, email, uidMSK, cpf, cnh, tipoCNH, localidade, brand, jobTitle };

    const camposFaltando = [];
    if (!nome) camposFaltando.push('nome');
    if (!email) camposFaltando.push('email');
    if (!uidMSK) camposFaltando.push('uidMSK');
    if (!cpf) camposFaltando.push('cpf');
    if (!cnh) camposFaltando.push('cnh');
    if (!tipoCNH) camposFaltando.push('tipoCNH');
    if (!localidade) camposFaltando.push('localidade');
    if (!brand) camposFaltando.push('brand');
    if (!jobTitle) camposFaltando.push('jobTitle');

    if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
    }

    try {
        const worker = await Colaborador.create({
            nome, email, uidMSK, password, type,
            localidade, brand, jobTitle, cpf, usaEstacionamento,
            cidadeEstacionamento, cnh, tipoCNH
        });

        return worker;
    } catch (error) {
        throw error;
    }
}

async function importWorkerCSV(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: "Arquivo CSV não enviado." });
    }

    const filePath = path.resolve(req.file.path);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "Arquivo não encontrado no servidor." });
    }

    const collaborators = [];
    let linhasProcessadas = 0;
    let linhasComErro = 0;

    try {
        await new Promise((resolve, reject) => {
            const parser = csv.parse({
                columns: true,
                trim: true,
                delimiter: ';',
                skip_empty_lines: true
            });

            fs.createReadStream(filePath, { encoding: 'utf8' })
                .pipe(parser)
                .on('data', (row) => {
                    linhasProcessadas++;
                    collaborators.push(row);
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        const resultados = [];

        for (let i = 0; i < collaborators.length; i++) {
            const collaboratorData = collaborators[i];

            try {
                const worker = await createWorkerFromCSV(collaboratorData);
                resultados.push({ sucesso: true, nome: worker.nome, id: worker.id });
            } catch (e) {
                linhasComErro++;
                resultados.push({
                    sucesso: false,
                    erro: e.message,
                    dados: collaboratorData,
                    linha: i + 1
                });
            }
        }

        const response = {
            message: "Processamento do CSV concluído!",
            total: collaborators.length,
            sucessos: collaborators.length - linhasComErro,
            erros: linhasComErro,
            detalhes: resultados
        };

        return res.status(201).json(response);

    } catch (error) {
        return res.status(500).json({
            error: "Erro ao importar colaboradores: " + error.message,
            stack: error.stack
        });
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
        const worker = await Colaborador.findOne({
            where: { uidMSK: uidMSK }
        })

        if (worker) {
            res.json(worker.toJSON())
        } else {
            res.status(404).json({ error: 'Colaborador não encontrado pelo UID' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar colaborador: ' + error.message })
    }
}

async function updateWorker(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const isDeactivating = updateData.status === false;

    try {
        const colaborador = await Colaborador.findByPk(id);
        if (!colaborador) {
            return res.status(404).json({ error: 'Colaborador não encontrado' });
        }

        const statusAnterior = colaborador.status;
        const colaboradorUid = colaborador.uidMSK;

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                colaborador[key] = updateData[key];
            }
        });

        await colaborador.validate();
        await colaborador.save();

        if (isDeactivating && statusAnterior === true) {
            console.log(`Colaborador ${colaboradorUid} desativado. Finalizando usos ativos de veículos...`);

            const resultadoFinalizacao = await finalizeActiveVehicleUsage(colaboradorUid);

            if (resultadoFinalizacao.success) {
                return res.json({
                    message: 'Colaborador atualizado com sucesso',
                    colaborador: colaborador.toJSON(),
                    veiculosLiberados: resultadoFinalizacao
                });
            } else {
                return res.status(207).json({ // 207 = Multi-Status
                    message: 'Colaborador atualizado, mas houve problemas ao liberar veículos',
                    colaborador: colaborador.toJSON(),
                    warning: resultadoFinalizacao.message,
                    veiculosLiberados: resultadoFinalizacao
                });
            }
        }

        return res.json({
            message: 'Colaborador atualizado com sucesso',
            colaborador: colaborador.toJSON()
        });

    } catch (error) {
        console.error('Erro ao atualizar colaborador:', error);
        return res.status(500).json({
            error: 'Erro ao atualizar colaborador: ' + error.message
        });
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

async function finalizeActiveVehicleUsage(colaboradorUid) {
    try {
        const historicosAtivos = await HistoricoUtilizacaoVeiculo.findAll({
            where: {
                colaboradorUid: colaboradorUid,
                dataFim: null
            },
            include: [
                {
                    model: Veiculo,
                    attributes: ['id', 'placa', 'status']
                }
            ]
        });

        if (historicosAtivos.length === 0) {
            console.log(`Nenhum uso ativo encontrado para o colaborador ${colaboradorUid}`);
            return {
                success: true,
                message: 'Nenhum uso ativo encontrado',
                finalizados: 0
            };
        }

        const dataFinalizacao = new Date();
        const resultados = [];

        for (const historico of historicosAtivos) {
            try {
                historico.dataFim = dataFinalizacao;
                await historico.save();

                if (historico.veiculo) {
                    const veiculo = await Veiculo.findByPk(historico.veiculo.id);
                    if (veiculo) {
                        veiculo.status = 'disponível';
                        await veiculo.save();
                    }
                }

                resultados.push({
                    historicoId: historico.id,
                    veiculoPlaca: historico.veiculoPlaca,
                    tipoUso: historico.tipoUso,
                    dataFinalizacao: dataFinalizacao,
                    success: true
                });

                console.log(`Uso finalizado: Veículo ${historico.veiculoPlaca} liberado do colaborador ${colaboradorUid}`);

            } catch (error) {
                console.error(`Erro ao finalizar uso do veículo ${historico.veiculoPlaca}:`, error);
                resultados.push({
                    historicoId: historico.id,
                    veiculoPlaca: historico.veiculoPlaca,
                    error: error.message,
                    success: false
                });
            }
        }

        const sucessos = resultados.filter(r => r.success).length;
        const erros = resultados.filter(r => !r.success).length;

        return {
            success: true,
            message: `Processamento concluído: ${sucessos} usos finalizados, ${erros} erros`,
            finalizados: sucessos,
            erros: erros,
            detalhes: resultados
        };

    } catch (error) {
        console.error(`Erro ao finalizar usos ativos do colaborador ${colaboradorUid}:`, error);
        return {
            success: false,
            message: 'Erro ao finalizar usos ativos: ' + error.message,
            error: error
        };
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
    deleteWorker,
    finalizeActiveVehicleUsage
}