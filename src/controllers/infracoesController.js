import Infracao from '../models/Infracao.js';
import Colaborador from '../models/Colaborador.js';
import * as csv from 'csv';
import fs from 'fs';
import path from 'path';
import { sendEmail } from '../services/mailer.js'

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
        !valor ||
        !marca ||
        !dataEnvio ||
        !indicacaoLimite ||
        !statusResposta
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
        await infracao.save();

        const colaborador = await Colaborador.findOne({
            where: { uidMSK: colaboradorUid }
        });

        if (colaborador?.email) {
            await sendEmail({
                to: colaborador.email,
                subject: `Notificação de Infração – ${codigoMulta || placaVeiculo}`,
                text: `Olá ${colaborador.nome},

Foi registrada uma infração do tipo "${tipo}" em ${dataInfracao}.

- Placa: ${placaVeiculo}
- Valor: R$ ${valor}
- Rodovia: ${rodovia || 'N/A'}

Acesse o sistema para mais detalhes.

Atenciosamente,
Equipe de Infrações`,
                html: `<p>Olá <strong>${colaborador.nome}</strong>,</p>
               <p>Foi registrada uma infração do tipo "<em>${tipo}</em>" em ${dataInfracao}.</p>
               <ul>
                 <li>Placa: ${placaVeiculo}</li>
                 <li>Valor: R$ ${valor}</li>
                 <li>Rodovia: ${rodovia || 'N/A'}</li>
               </ul>
               <p>Acesse o sistema para mais detalhes.</p>
               <p>Atenciosamente,<br/>Equipe de Infrações</p>`
            })
        } else {
            console.warn(`Colaborador ${colaboradorUid} não encontrado ou sem e-mail.`)
        }

        return res.status(201).json({ message: 'Infração criada e e-mail enviado.' })
    } catch (error) {
        console.error('Erro ao criar infração:', error)
        return res.status(500).json({ error: 'Erro ao criar infração: ' + error.message })
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

    const camposObrigatorios = {
        tipo,
        colaboradorUid,
        placaVeiculo,
        costCenter,
        dataInfracao,
        valor,
        marca,
        dataEnvio,
        indicacaoLimite,
        statusResposta
    };

    const camposFaltando = [];
    if (!tipo) camposFaltando.push('tipo');
    if (!colaboradorUid) camposFaltando.push('colaboradorUid');
    if (!placaVeiculo) camposFaltando.push('placaVeiculo');
    if (!costCenter) camposFaltando.push('costCenter');
    if (!dataInfracao) camposFaltando.push('dataInfracao');
    if (!valor) camposFaltando.push('valor');
    if (!marca) camposFaltando.push('marca');
    if (!dataEnvio) camposFaltando.push('dataEnvio');
    if (!indicacaoLimite) camposFaltando.push('indicacaoLimite');
    if (!statusResposta) camposFaltando.push('statusResposta');

    if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
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

        try {
            const colaborador = await Colaborador.findOne({
                where: { uidMSK: colaboradorUid }
            });

            if (colaborador?.email) {
                await sendEmail({
                    to: colaborador.email,
                    subject: `Notificação de Infração – ${codigoMulta || placaVeiculo}`,
                    text: `Olá ${colaborador.nome},

Foi registrada uma infração do tipo "${tipo}" em ${dataInfracao}.

- Placa: ${placaVeiculo}
- Valor: R$ ${valor}
- Rodovia: ${rodovia || 'N/A'}

Acesse o sistema para mais detalhes.

Atenciosamente,
Equipe de Infrações`,
                    html: `<p>Olá <strong>${colaborador.nome}</strong>,</p>
                   <p>Foi registrada uma infração do tipo "<em>${tipo}</em>" em ${dataInfracao}.</p>
                   <ul>
                     <li>Placa: ${placaVeiculo}</li>
                     <li>Valor: R$ ${valor}</li>
                     <li>Rodovia: ${rodovia || 'N/A'}</li>
                   </ul>
                   <p>Acesse o sistema para mais detalhes.</p>
                   <p>Atenciosamente,<br/>Equipe de Infrações</p>`
                });
            } else {
                console.warn(`Colaborador ${colaboradorUid} não encontrado ou sem e-mail durante importação CSV.`);
            }
        } catch (emailError) {
            console.error(`Erro ao enviar email para colaborador ${colaboradorUid}:`, emailError);
        }

        return infraction;
    } catch (error) {
        throw error;
    }
}

async function importInfractionCSV(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: "Arquivo CSV não enviado." });
    }

    const filePath = path.resolve(req.file.path);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "Arquivo não encontrado no servidor." });
    }

    const infractions = [];
    let linhasProcessadas = 0;
    let linhasComErro = 0;
    let emailsEnviados = 0;

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
                    infractions.push(row);
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        const resultados = [];

        for (let i = 0; i < infractions.length; i++) {
            const infractionData = infractions[i];

            try {
                const infraction = await createInfractionFromCSV(infractionData);
                const colaborador = await Colaborador.findOne({
                    where: { uidMSK: infractionData.colaboradorUid }
                });

                if (colaborador?.email) {
                    emailsEnviados++;
                }

                resultados.push({
                    sucesso: true,
                    tipo: infraction.tipo,
                    id: infraction.id,
                    colaboradorUid: infraction.colaboradorUid,
                    emailEnviado: !!colaborador?.email
                });
            } catch (e) {
                linhasComErro++;
                resultados.push({
                    sucesso: false,
                    erro: e.message,
                    dados: infractionData,
                    linha: i + 1,
                    emailEnviado: false
                });
            }
        }

        const response = {
            message: "Processamento do CSV de infrações concluído!",
            total: infractions.length,
            sucessos: infractions.length - linhasComErro,
            erros: linhasComErro,
            emailsEnviados: emailsEnviados,
            detalhes: resultados
        };

        return res.status(201).json(response);

    } catch (error) {
        return res.status(500).json({
            error: "Erro ao importar infrações: " + error.message,
            stack: error.stack
        });
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