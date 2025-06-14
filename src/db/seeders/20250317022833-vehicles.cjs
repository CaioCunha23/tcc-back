'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('veiculos', [
      {
        fornecedor: "Fornecedor A",
        contrato: "Contrato A1",
        placa: "ABC1234",
        renavam: "REN00000001",
        chassi: "CHAS00000001",
        modelo: "Modelo A",
        cor: "Preto",
        status: "Disponível",
        cliente: "Cliente X",
        perfil: "Perfil A",
        centroCusto: "Centro 1",
        franquiaKM: 1500,
        carroReserva: false,
        dataDisponibilizacao: new Date("2025-03-01T00:00:00Z"),
        mesesContratados: 12,
        previsaoDevolucao: new Date("2026-07-01T00:00:00Z"),
        mesesFaltantes: 6,
        mensalidade: 1500.00,
        budget: 2000.00,
        multa: 300.00,
        proximaRevisao: new Date("2025-06-01T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor B",
        contrato: "Contrato B1",
        placa: "DEF5678",
        renavam: "REN00000002",
        chassi: "CHAS00000002",
        modelo: "Modelo B",
        cor: "Branco",
        status: "Em Uso",
        cliente: "Cliente Y",
        perfil: "Perfil B",
        centroCusto: "Centro 2",
        franquiaKM: 1800,
        carroReserva: true,
        dataDisponibilizacao: new Date("2024-12-01T00:00:00Z"),
        mesesContratados: 24,
        previsaoDevolucao: new Date("2025-06-30T00:00:00Z"),
        mesesFaltantes: 20,
        mensalidade: 1600.00,
        budget: 2200.00,
        multa: 250.00,
        proximaRevisao: new Date("2025-04-01T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor C",
        contrato: "Contrato C1",
        placa: "GHI9101",
        renavam: "REN00000003",
        chassi: "CHAS00000003",
        modelo: "Modelo C",
        cor: "Prata",
        status: "Manutenção",
        cliente: "Cliente Z",
        perfil: "Perfil C",
        centroCusto: "Centro 3",
        franquiaKM: 1200,
        carroReserva: false,
        dataDisponibilizacao: new Date("2025-01-15T00:00:00Z"),
        mesesContratados: 18,
        previsaoDevolucao: new Date("2025-07-15T00:00:00Z"),
        mesesFaltantes: 10,
        mensalidade: 1450.00,
        budget: 1900.00,
        multa: 200.00,
        proximaRevisao: new Date("2025-05-15T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor D",
        contrato: "Contrato D1",
        placa: "JKL2345",
        renavam: "REN00000004",
        chassi: "CHAS00000004",
        modelo: "Modelo D",
        cor: "Azul",
        status: "Disponível",
        cliente: "Cliente W",
        perfil: "Perfil D",
        centroCusto: "Centro 4",
        franquiaKM: 1600,
        carroReserva: true,
        dataDisponibilizacao: new Date("2025-02-10T00:00:00Z"),
        mesesContratados: 12,
        previsaoDevolucao: new Date("2026-02-10T00:00:00Z"),
        mesesFaltantes: 11,
        mensalidade: 1700.00,
        budget: 2100.00,
        multa: 350.00,
        proximaRevisao: new Date("2025-06-10T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor E",
        contrato: "Contrato E1",
        placa: "MNO6789",
        renavam: "REN00000005",
        chassi: "CHAS00000005",
        modelo: "Modelo E",
        cor: "Vermelho",
        status: "Em Uso",
        cliente: "Cliente V",
        perfil: "Perfil E",
        centroCusto: "Centro 5",
        franquiaKM: 2000,
        carroReserva: false,
        dataDisponibilizacao: new Date("2024-11-05T00:00:00Z"),
        mesesContratados: 36,
        previsaoDevolucao: new Date("2027-11-05T00:00:00Z"),
        mesesFaltantes: 30,
        mensalidade: 1800.00,
        budget: 2500.00,
        multa: 400.00,
        proximaRevisao: new Date("2025-05-05T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor F",
        contrato: "Contrato F1",
        placa: "PQR1234",
        renavam: "REN00000006",
        chassi: "CHAS00000006",
        modelo: "Modelo F",
        cor: "Cinza",
        status: "Disponível",
        cliente: "Cliente U",
        perfil: "Perfil F",
        centroCusto: "Centro 6",
        franquiaKM: 1700,
        carroReserva: true,
        dataDisponibilizacao: new Date("2025-04-01T00:00:00Z"),
        mesesContratados: 24,
        previsaoDevolucao: new Date("2027-04-01T00:00:00Z"),
        mesesFaltantes: 24,
        mensalidade: 1750.00,
        budget: 2400.00,
        multa: 380.00,
        proximaRevisao: new Date("2025-08-01T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor G",
        contrato: "Contrato G1",
        placa: "STU4321",
        renavam: "REN00000007",
        chassi: "CHAS00000007",
        modelo: "Modelo G",
        cor: "Preto",
        status: "Em Uso",
        cliente: "Cliente T",
        perfil: "Perfil G",
        centroCusto: "Centro 7",
        franquiaKM: 1600,
        carroReserva: false,
        dataDisponibilizacao: new Date("2024-10-01T00:00:00Z"),
        mesesContratados: 18,
        previsaoDevolucao: new Date("2026-04-01T00:00:00Z"),
        mesesFaltantes: 12,
        mensalidade: 1650.00,
        budget: 2200.00,
        multa: 310.00,
        proximaRevisao: new Date("2025-02-01T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor H",
        contrato: "Contrato H1",
        placa: "VWX8765",
        renavam: "REN00000008",
        chassi: "CHAS00000008",
        modelo: "Modelo H",
        cor: "Azul",
        status: "Manutenção",
        cliente: "Cliente S",
        perfil: "Perfil H",
        centroCusto: "Centro 8",
        franquiaKM: 1400,
        carroReserva: true,
        dataDisponibilizacao: new Date("2025-05-01T00:00:00Z"),
        mesesContratados: 20,
        previsaoDevolucao: new Date("2027-01-01T00:00:00Z"),
        mesesFaltantes: 20,
        mensalidade: 1780.00,
        budget: 2350.00,
        multa: 290.00,
        proximaRevisao: new Date("2025-09-01T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor I",
        contrato: "Contrato I1",
        placa: "YZA3456",
        renavam: "REN00000009",
        chassi: "CHAS00000009",
        modelo: "Modelo I",
        cor: "Verde",
        status: "Disponível",
        cliente: "Cliente R",
        perfil: "Perfil I",
        centroCusto: "Centro 9",
        franquiaKM: 1300,
        carroReserva: false,
        dataDisponibilizacao: new Date("2025-01-20T00:00:00Z"),
        mesesContratados: 12,
        previsaoDevolucao: new Date("2026-01-20T00:00:00Z"),
        mesesFaltantes: 9,
        mensalidade: 1500.00,
        budget: 2100.00,
        multa: 280.00,
        proximaRevisao: new Date("2025-07-20T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor J",
        contrato: "Contrato J1",
        placa: "BCD7890",
        renavam: "REN00000010",
        chassi: "CHAS00000010",
        modelo: "Modelo J",
        cor: "Branco",
        status: "Em Uso",
        cliente: "Cliente Q",
        perfil: "Perfil J",
        centroCusto: "Centro 10",
        franquiaKM: 1900,
        carroReserva: true,
        dataDisponibilizacao: new Date("2024-09-15T00:00:00Z"),
        mesesContratados: 24,
        previsaoDevolucao: new Date("2026-09-15T00:00:00Z"),
        mesesFaltantes: 17,
        mensalidade: 1850.00,
        budget: 2600.00,
        multa: 330.00,
        proximaRevisao: new Date("2025-03-15T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor K",
        contrato: "Contrato K1",
        placa: "EFG0123",
        renavam: "REN00000011",
        chassi: "CHAS00000011",
        modelo: "Modelo K",
        cor: "Preto",
        status: "Manutenção",
        cliente: "Cliente P",
        perfil: "Perfil K",
        centroCusto: "Centro 11",
        franquiaKM: 1750,
        carroReserva: false,
        dataDisponibilizacao: new Date("2025-03-10T00:00:00Z"),
        mesesContratados: 30,
        previsaoDevolucao: new Date("2027-09-10T00:00:00Z"),
        mesesFaltantes: 30,
        mensalidade: 1900.00,
        budget: 2700.00,
        multa: 410.00,
        proximaRevisao: new Date("2025-07-10T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor L",
        contrato: "Contrato L1",
        placa: "HIJ4567",
        renavam: "REN00000012",
        chassi: "CHAS00000012",
        modelo: "Modelo L",
        cor: "Cinza",
        status: "Disponível",
        cliente: "Cliente O",
        perfil: "Perfil L",
        centroCusto: "Centro 12",
        franquiaKM: 1100,
        carroReserva: true,
        dataDisponibilizacao: new Date("2025-04-05T00:00:00Z"),
        mesesContratados: 15,
        previsaoDevolucao: new Date("2026-07-05T00:00:00Z"),
        mesesFaltantes: 15,
        mensalidade: 1550.00,
        budget: 1950.00,
        multa: 275.00,
        proximaRevisao: new Date("2025-08-05T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor M",
        contrato: "Contrato M1",
        placa: "KLM8901",
        renavam: "REN00000013",
        chassi: "CHAS00000013",
        modelo: "Modelo M",
        cor: "Amarelo",
        status: "Em Uso",
        cliente: "Cliente N",
        perfil: "Perfil M",
        centroCusto: "Centro 13",
        franquiaKM: 1000,
        carroReserva: false,
        dataDisponibilizacao: new Date("2025-02-20T00:00:00Z"),
        mesesContratados: 12,
        previsaoDevolucao: new Date("2026-02-20T00:00:00Z"),
        mesesFaltantes: 10,
        mensalidade: 1490.00,
        budget: 1990.00,
        multa: 290.00,
        proximaRevisao: new Date("2025-06-20T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fornecedor: "Fornecedor N",
        contrato: "Contrato N1",
        placa: "NOP2345",
        renavam: "REN00000014",
        chassi: "CHAS00000014",
        modelo: "Modelo N",
        cor: "Vermelho",
        status: "Manutenção",
        cliente: "Cliente M",
        perfil: "Perfil N",
        centroCusto: "Centro 14",
        franquiaKM: 1250,
        carroReserva: true,
        dataDisponibilizacao: new Date("2025-03-25T00:00:00Z"),
        mesesContratados: 18,
        previsaoDevolucao: new Date("2026-09-25T00:00:00Z"),
        mesesFaltantes: 18,
        mensalidade: 1580.00,
        budget: 2050.00,
        multa: 310.00,
        proximaRevisao: new Date("2025-07-25T00:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('veiculos', null, {});
  }
};