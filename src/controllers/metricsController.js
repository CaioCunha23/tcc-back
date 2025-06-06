import { Op } from 'sequelize';
import Infracao from '../models/Infracao.js'
import Veiculo from '../models/Veiculo.js';

async function getDashboardMetrics(req, res) {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const totalInfractionsValue = (await Infracao.sum("valor")) || 0;

        const currentMultas = (await Infracao.sum("valor", {
            where: {
                tipo: "multa",
                dataInfracao: { [Op.between]: [currentMonthStart, now] },
            },
        })) || 0;

        const previousMultas = (await Infracao.sum("valor", {
            where: {
                tipo: "multa",
                dataInfracao: { [Op.between]: [previousMonthStart, previousMonthEnd] },
            },
        })) || 0;

        let growthMultas = 0;
        let growthMultasPercent = 0;
        if (previousMultas > 0) {
            growthMultas = currentMultas - previousMultas;
            growthMultasPercent = ((currentMultas - previousMultas) / previousMultas) * 100;
        }

        const currentSemParar = (await Infracao.sum("valor", {
            where: {
                tipo: "sem parar",
                dataInfracao: { [Op.between]: [currentMonthStart, now] },
            },
        })) || 0;

        const previousSemParar = (await Infracao.sum("valor", {
            where: {
                tipo: "sem parar",
                dataInfracao: { [Op.between]: [previousMonthStart, previousMonthEnd] },
            },
        })) || 0;

        let growthSemParar = 0;
        let growthSemPararPercent = 0;
        if (previousSemParar > 0) {
            growthSemParar = currentSemParar - previousSemParar;
            growthSemPararPercent = ((currentSemParar - previousSemParar) / previousSemParar) * 100;
        }

        const vehiclesInUse = await Veiculo.count({ where: { status: "em uso" } });
        const vehiclesInMaintenance = await Veiculo.count({ where: { status: "em manutenção" } });
        const vehiclesAvailable = await Veiculo.count({ where: { status: "Disponível" } });

        let userTotalInfractionsValue = 0;
        let userTotalMultasValue = 0;
        let userTotalSemPararValue = 0;
        let userCurrentMultasValue = 0;
        let userPreviousMultasValue = 0;
        let userCurrentSemPararValue = 0;
        let userPreviousSemPararValue = 0;
        let userGrowthMultas = 0;
        let userGrowthMultasPercent = 0;
        let userGrowthSemParar = 0;
        let userGrowthSemPararPercent = 0;

        if (req.user && req.user.uidMSK) {
            userTotalInfractionsValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                },
            })) || 0;

            userTotalMultasValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                    tipo: "multa",
                },
            })) || 0;

            userTotalSemPararValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                    tipo: "sem parar",
                },
            })) || 0;

            userCurrentMultasValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                    tipo: "multa",
                    dataInfracao: { [Op.between]: [currentMonthStart, now] },
                },
            })) || 0;

            userPreviousMultasValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                    tipo: "multa",
                    dataInfracao: { [Op.between]: [previousMonthStart, previousMonthEnd] },
                },
            })) || 0;

            userCurrentSemPararValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                    tipo: "sem parar",
                    dataInfracao: { [Op.between]: [currentMonthStart, now] },
                },
            })) || 0;

            userPreviousSemPararValue = (await Infracao.sum("valor", {
                where: {
                    colaboradorUid: req.user.uidMSK,
                    tipo: "sem parar",
                    dataInfracao: { [Op.between]: [previousMonthStart, previousMonthEnd] },
                },
            })) || 0;

            if (userPreviousMultasValue > 0) {
                userGrowthMultas = userCurrentMultasValue - userPreviousMultasValue;
                userGrowthMultasPercent = ((userCurrentMultasValue - userPreviousMultasValue) / userPreviousMultasValue) * 100;
            }

            if (userPreviousSemPararValue > 0) {
                userGrowthSemParar = userCurrentSemPararValue - userPreviousSemPararValue;
                userGrowthSemPararPercent = ((userCurrentSemPararValue - userPreviousSemPararValue) / userPreviousSemPararValue) * 100;
            }

        } else {
            console.log('- req.user ou req.user.uidMSK não encontrado');
        }

        const response = {
            totalInfractionsValue: parseFloat(totalInfractionsValue),
            growthMultas,
            growthMultasPercent,
            growthSemParar,
            growthSemPararPercent,
            vehiclesInUse,
            vehiclesInMaintenance,
            vehiclesAvailable,
            userTotalInfractionsValue: parseFloat(userTotalInfractionsValue),
            userTotalMultasValue: parseFloat(userTotalMultasValue),
            userTotalSemPararValue: parseFloat(userTotalSemPararValue),
            userGrowthMultas,
            userGrowthMultasPercent,
            userGrowthSemParar,
            userGrowthSemPararPercent,
        };

        return res.json(response);
    } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

async function getInfracoesChartData(req, res) {
    try {
        const globalResults = await Infracao.findAll({
            attributes: [
                [Infracao.sequelize.fn("DATE_FORMAT", Infracao.sequelize.col("dataInfracao"), "%Y-%m"), "month"],
                "tipo",
                [Infracao.sequelize.fn("SUM", Infracao.sequelize.col("valor")), "totalValor"],
            ],
            group: ["month", "tipo"],
            order: [[Infracao.sequelize.literal("month"), "ASC"]],
        });

        let userResults = [];
        if (req.user && req.user.uidMSK) {
            userResults = await Infracao.findAll({
                attributes: [
                    [Infracao.sequelize.fn("DATE_FORMAT", Infracao.sequelize.col("dataInfracao"), "%Y-%m"), "month"],
                    "tipo",
                    [Infracao.sequelize.fn("SUM", Infracao.sequelize.col("valor")), "totalValor"],
                ],
                where: { colaboradorUid: req.user.uidMSK },
                group: ["month", "tipo"],
                order: [[Infracao.sequelize.literal("month"), "ASC"]],
            });
        }

        const mapGlobal = {};
        globalResults.forEach(item => {
            const month = item.get("month");
            const tipo = item.get("tipo");
            const totalValor = parseFloat(item.get("totalValor"));

            if (!mapGlobal[month]) {
                mapGlobal[month] = { multa: 0, semParar: 0 };
            }
            if (tipo === "multa") {
                mapGlobal[month].multa = totalValor;
            } else if (tipo === "sem parar") {
                mapGlobal[month].semParar = totalValor;
            }
        });

        const mapUser = {};
        userResults.forEach(item => {
            const month = item.get("month");
            const tipo = item.get("tipo");
            const totalValor = parseFloat(item.get("totalValor"));

            if (!mapUser[month]) {
                mapUser[month] = { multa: 0, semParar: 0 };
            }
            if (tipo === "multa") {
                mapUser[month].multa = totalValor;
            } else if (tipo === "sem parar") {
                mapUser[month].semParar = totalValor;
            }
        });

        const isAdmin = req.user?.role === 'admin' ||
            req.user?.isAdmin === true ||
            req.user?.type === 'admin' ||
            req.user?.nivel === 'admin' ||
            req.user?.perfil === 'admin';


        let chartData;
        if (isAdmin) {
            chartData = Object.keys(mapGlobal).map(month => ({
                date: month,
                multa: mapGlobal[month].multa,
                semParar: mapGlobal[month].semParar,
            }));
        } else {
            chartData = Object.keys(mapUser).map(month => ({
                date: month,
                multa: mapUser[month].multa,
                semParar: mapUser[month].semParar,
            }));
        }

        if (!isAdmin && Object.keys(mapUser).length === 0) {
            chartData = [];
        }

        if (isAdmin && Object.keys(mapGlobal).length === 0) {
            chartData = [];
        }

        chartData.sort((a, b) => a.date.localeCompare(b.date));

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