import { Op } from 'sequelize';
import Infracao from '../models/Infracao.js'
import Veiculo from '../models/Veiculo.js';

async function getDashboardMetrics(req, res) {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // total gasto com infrações
        const totalInfractionsValue = (await Infracao.sum('valor')) || 0;

        // som do mes atual com o anterior de multas
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

        // variação percentual se o período anterior tiver valor > 0
        let growthMultas = 0;
        let growthMultasPercent = 0;
        if (previousMultas > 0) {
            growthMultas = currentMultas - previousMultas;
            growthMultasPercent = ((currentMultas - previousMultas) / previousMultas) * 100;
        }

        // soma do mês atual e do mês anterior sem parar
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

        // variação percentual se o período anterior tiver valor > 0
        let growthSemParar = 0;
        let growthSemPararPercent = 0;
        if (previousSemParar > 0) {
            growthSemParar = currentSemParar - previousSemParar;
            growthSemPararPercent = ((currentSemParar - previousSemParar) / previousSemParar) * 100;
        }

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
        const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // infrações por colaborador para o início do mês atual até o dia
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

        // infrações por colaborador para o mês anterior
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

        // acesso rápido aos dados do período anterior
        const previousMap = {};
        previousCounts.forEach(record => {
            previousMap[record.colaboradorUid] = parseInt(record.get('previousCount'));
        });

        const results = [];
        currentCounts.forEach(record => {
            const colaboradorUid = record.colaboradorUid;
            const currentCount = parseInt(record.get('currentCount'));
            const previousCount = previousMap[colaboradorUid] || 0;
            let growth = 0;
            if (previousCount > 0) {
                growth = ((currentCount - previousCount) / previousCount) * 100;
            } else if (currentCount > 0) {
                growth = 100;
            }
            results.push({
                colaboradorUid,
                currentCount,
                previousCount,
                growth: parseFloat(growth.toFixed(2))
            });
        });

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
        const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const totalInfractions = await Infracao.count({
            where: {
                dataInfracao: { [Op.between]: [previousPeriodStart, previousPeriodEnd] }
            }
        });

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

        // porcentagem de infrações de cada colaborador em relação ao total do mês anterior
        const results = offenders.map(record => {
            const infractionCount = parseInt(record.get('infractionCount'));
            const percentage = totalInfractions > 0 ? (infractionCount / totalInfractions) * 100 : 0;
            return {
                colaboradorUid: record.colaboradorUid,
                infractionCount,
                percentage: parseFloat(percentage.toFixed(2))
            };
        });

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
        const thresholdDays = 30;
        const upperLimit = new Date();
        upperLimit.setDate(now.getDate() + thresholdDays);

        const multas = await Infracao.findAll({
            where: {
                tipo: 'multa',
                indicacaoLimite: {
                    [Op.between]: [now, upperLimit]
                }
            },
            order: [['indicacaoLimite', 'ASC']]
        });

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