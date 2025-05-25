import { Op } from 'sequelize';
import Infracao from '../models/Infracao.js'
import Veiculo from '../models/Veiculo.js';

async function getDashboardMetrics(req, res) {
    try {
        const now = new Date();
        // Define início do mês atual (primeiro dia do mês atual)
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        // Define início do mês anterior (primeiro dia do mês anterior)
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        // Define o fim do mês anterior (último dia do mês anterior)
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Total gasto com infrações (soma de todos os valores)
        const totalInfractionsValue = (await Infracao.sum('valor')) || 0;

        // 2. Para 'multas': soma dos valores do mês atual e do mês anterior
        const currentMultas = (await Infracao.sum('valor', {
            where: {
                tipo: 'multa',
                dataInfracao: { [Op.between]: [currentMonthStart, now] }
            }
        })) || 0;

        const previousMultas = (await Infracao.sum('valor', {
            where: {
                tipo: 'multa',
                dataInfracao: { [Op.between]: [previousMonthStart, previousMonthEnd] }
            }
        })) || 0;

        // Calcula a variação percentual se o período anterior tiver valor > 0
        let growthMultas = 0;
        let growthMultasPercent = 0;
        if (previousMultas > 0) {
            growthMultas = currentMultas - previousMultas;
            growthMultasPercent = ((currentMultas - previousMultas) / previousMultas) * 100;
        }

        // 3. Para 'sem parar': soma dos valores do mês atual e do mês anterior
        const currentSemParar = (await Infracao.sum('valor', {
            where: {
                tipo: 'sem parar',
                dataInfracao: { [Op.between]: [currentMonthStart, now] }
            }
        })) || 0;

        const previousSemParar = (await Infracao.sum('valor', {
            where: {
                tipo: 'sem parar',
                dataInfracao: { [Op.between]: [previousMonthStart, previousMonthEnd] }
            }
        })) || 0;

        // Calcula a variação percentual se o período anterior tiver valor > 0
        let growthSemParar = 0;
        let growthSemPararPercent = 0;
        if (previousSemParar > 0) {
            growthSemParar = currentSemParar - previousSemParar;
            growthSemPararPercent = ((currentSemParar - previousSemParar) / previousSemParar) * 100;
        }

        // Outras métricas relacionadas aos veículos
        const vehiclesInUse = await Veiculo.count({
            where: { status: 'em uso' }
        });
        const vehiclesInMaintenance = await Veiculo.count({
            where: { status: 'em manutenção' }
        });
        const vehiclesAvailable = await Veiculo.count({
            where: { status: 'Disponível' }
        });

        return res.json({
            totalInfractionsValue: parseFloat(totalInfractionsValue),
            // Arredonda para uma casa decimal
            growthMultas,
            growthMultasPercent,
            growthSemParar,
            growthSemPararPercent,
            vehiclesInUse,
            vehiclesInMaintenance,
            vehiclesAvailable
        });
    } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

async function getInfracoesChartData(req, res) {
    try {
        // Agrupa as infrações por mês (formato YYYY-MM) e tipo, somando os valores
        const results = await Infracao.findAll({
            attributes: [
                [Infracao.sequelize.fn("DATE_FORMAT", Infracao.sequelize.col("dataInfracao"), "%Y-%m"), "month"],
                "tipo",
                [Infracao.sequelize.fn("SUM", Infracao.sequelize.col("valor")), "totalValor"]
            ],
            group: ["month", "tipo"],
            order: [[Infracao.sequelize.literal("month"), "ASC"]]
        });

        const chartDataMap = {};

        results.forEach(item => {
            const month = item.get("month");
            const tipo = item.get("tipo");
            const totalValor = parseFloat(item.get("totalValor"));

            if (!chartDataMap[month]) {
                chartDataMap[month] = { date: month, multa: 0, semParar: 0 };
            }

            if (tipo === "multa") {
                chartDataMap[month].multa = totalValor;
            } else if (tipo === "sem parar") {
                chartDataMap[month].semParar = totalValor;
            }
        });

        // Converte o objeto para um array e ordena pelos meses
        const chartData = Object.values(chartDataMap).sort((a, b) => a.date.localeCompare(b.date));

        return res.json(chartData);
    } catch (error) {
        console.error("Erro ao buscar dados do gráfico de infrações:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function getColaboradorMaiorAumento(req, res) {
    try {
        const now = new Date();
        // Define o início do mês atual (primeiro dia do mês atual)
        const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        // Define o período do mês anterior: do primeiro dia do mês anterior até o último dia do mês anterior
        const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Agrupa infrações por colaborador para o período atual (desde o início do mês atual até agora)
        const currentCounts = await Infracao.findAll({
            attributes: [
                'colaboradorUid',
                [Infracao.sequelize.fn('COUNT', Infracao.sequelize.col('id')), 'currentCount']
            ],
            where: {
                dataInfracao: {
                    [Op.between]: [currentPeriodStart, now]
                }
            },
            group: ['colaboradorUid']
        });

        // 2. Agrupa infrações por colaborador para o mês anterior (período completo)
        const previousCounts = await Infracao.findAll({
            attributes: [
                'colaboradorUid',
                [Infracao.sequelize.fn('COUNT', Infracao.sequelize.col('id')), 'previousCount']
            ],
            where: {
                dataInfracao: {
                    [Op.between]: [previousPeriodStart, previousPeriodEnd]
                }
            },
            group: ['colaboradorUid']
        });

        // Cria um mapa para acesso rápido aos dados do período anterior
        const previousMap = {};
        previousCounts.forEach(record => {
            previousMap[record.colaboradorUid] = parseInt(record.get('previousCount'));
        });

        // Prepara a lista de resultados, calculando a variação percentual
        const results = [];
        currentCounts.forEach(record => {
            const colaboradorUid = record.colaboradorUid;
            const currentCount = parseInt(record.get('currentCount'));
            const previousCount = previousMap[colaboradorUid] || 0;
            let growth = 0;
            if (previousCount > 0) {
                growth = ((currentCount - previousCount) / previousCount) * 100;
            } else if (currentCount > 0) {
                // Se não houve registros no período anterior, atribui crescimento arbitrário (100%)
                growth = 100;
            }
            results.push({
                colaboradorUid,
                currentCount,
                previousCount,
                growth: parseFloat(growth.toFixed(2))
            });
        });

        // Ordena os resultados pelo crescimento (em ordem decrescente)
        results.sort((a, b) => b.growth - a.growth);

        return res.json(results);
    } catch (error) {
        console.error("Erro no endpoint 'colaborador-maior-aumento':", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function getTopOffenders(req, res) {
    try {
        const now = new Date();
        // Define o período do mês anterior: do primeiro dia ao último dia do mês anterior
        const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Total de infrações no mês anterior.
        const totalInfractions = await Infracao.count({
            where: {
                dataInfracao: { [Op.between]: [previousPeriodStart, previousPeriodEnd] }
            }
        });

        // 2. Agrupa as infrações por colaborador para o mês anterior.
        const offenders = await Infracao.findAll({
            attributes: [
                'colaboradorUid',
                [Infracao.sequelize.fn('COUNT', Infracao.sequelize.col('id')), 'infractionCount']
            ],
            where: {
                dataInfracao: { [Op.between]: [previousPeriodStart, previousPeriodEnd] }
            },
            group: ['colaboradorUid']
        });

        // 3. Calcula a porcentagem de infrações de cada colaborador em relação ao total do mês anterior.
        const results = offenders.map(record => {
            const infractionCount = parseInt(record.get('infractionCount'));
            const percentage = totalInfractions > 0 ? (infractionCount / totalInfractions) * 100 : 0;
            return {
                colaboradorUid: record.colaboradorUid,
                infractionCount,
                percentage: parseFloat(percentage.toFixed(2))
            };
        });

        // 4. Ordena os resultados por porcentagem e retorna os 5 principais.
        results.sort((a, b) => b.percentage - a.percentage);
        const topFive = results.slice(0, 5);

        return res.json(topFive);
    } catch (error) {
        console.error("Erro no endpoint 'top-offenders':", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function getVeiculosContratoProximo(req, res) {
  try {
    const hoje = new Date()
    const tresMeses = new Date()
    tresMeses.setMonth(hoje.getMonth() + 3)

    const veiculos = await Veiculo.findAll({
      where: {
        previsaoDevolucao: {
          [Op.between]: [hoje, tresMeses],
        },
      },
      attributes: ['placa', 'previsaoDevolucao'],
      order: [['previsaoDevolucao', 'ASC']],
    })

    return res.json(veiculos)
  } catch (err) {
    console.error('Erro ao buscar veículos com contrato próximo:', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
}

export async function getMultasProximasVencer(req, res) {
    try {
        const now = new Date();
        // Define o período: próximos 30 dias
        const thresholdDays = 30;
        const upperLimit = new Date();
        upperLimit.setDate(now.getDate() + thresholdDays);

        // Busca as multas cuja data de vencimento esteja entre hoje e os próximos 30 dias
        const multas = await Infracao.findAll({
            where: {
                tipo: 'multa',
                indicacaoLimite: {
                    [Op.between]: [now, upperLimit]
                }
            },
            order: [['indicacaoLimite', 'ASC']]
        });

        // Acrescenta a informação de quantos dias faltam para o vencimento
        const multasWithDaysUntilVencimento = multas.map(multa => {
            const dataVencimento = new Date(multa.indicacaoLimite);
            const diffTime = dataVencimento.getTime() - now.getTime();
            const daysUntilVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                ...multa.dataValues,
                daysUntilVencimento
            };
        });

        return res.json(multasWithDaysUntilVencimento);
    } catch (error) {
        console.error("Erro ao buscar multas próximas de vencer:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export default {
    getDashboardMetrics,
    getInfracoesChartData,
    getColaboradorMaiorAumento,
    getTopOffenders,
    getVeiculosContratoProximo,
    getMultasProximasVencer
};