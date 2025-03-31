import { Op } from 'sequelize';
import Infracao from '../models/Infracao.js'
import Veiculo from '../models/Veiculo.js';

async function getDashboardMetrics(req, res) {
    try {
        // Define os períodos: últimos 30 dias (atual) e os 30 dias anteriores (anterior)
        const now = new Date();
        const currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 30);
        const previousPeriodStart = new Date(now);
        previousPeriodStart.setDate(now.getDate() - 60);

        // 1. Total gasto com infrações (soma de todos os valores)
        const totalInfractionsValue = (await Infracao.sum('valor')) || 0;

        // 2. Para 'multas': soma dos valores do período atual e anterior
        const currentMultas = (await Infracao.sum('valor', {
            where: {
                tipo: 'multa',
                dataInfracao: { [Op.between]: [currentPeriodStart, now] }
            }
        })) || 0;
        const previousMultas = (await Infracao.sum('valor', {
            where: {
                tipo: 'multa',
                dataInfracao: { [Op.between]: [previousPeriodStart, currentPeriodStart] }
            }
        })) || 0;
        // Calcula a variação percentual se o período anterior tiver valor > 0
        let growthMultas = 0;
        if (previousMultas > 0) {
            growthMultas = ((currentMultas - previousMultas) / previousMultas) * 100;
        }

        // 3. Para 'sem parar': soma dos valores do período atual e anterior
        const currentSemParar = (await Infracao.sum('valor', {
            where: {
                tipo: 'sem parar',
                dataInfracao: { [Op.between]: [currentPeriodStart, now] }
            }
        })) || 0;
        const previousSemParar = (await Infracao.sum('valor', {
            where: {
                tipo: 'sem parar',
                dataInfracao: { [Op.between]: [previousPeriodStart, currentPeriodStart] }
            }
        })) || 0;
        // Calcula a variação percentual se o período anterior tiver valor > 0
        let growthSemParar = 0;
        if (previousSemParar > 0) {
            growthSemParar = ((currentSemParar - previousSemParar) / previousSemParar) * 100;
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
            growthMultas: parseFloat(growthMultas.toFixed(1)),
            growthSemParar: parseFloat(growthSemParar.toFixed(1)),
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

export default {
    getDashboardMetrics,
    getInfracoesChartData
};