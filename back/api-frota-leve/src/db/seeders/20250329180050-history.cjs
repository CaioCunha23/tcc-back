'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('historico_utilizacao_veiculos', [
      {
        colaboradorUid: "JSI123",
        veiculoPlaca: "ABC1234",
        dataInicio: new Date("2024-01-10T00:00:00Z"),
        dataFim: null,
        tipoUso: "fixo",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "MOL456",
        veiculoPlaca: "DEF5678",
        dataInicio: new Date("2023-11-05T00:00:00Z"),
        dataFim: new Date("2023-11-10T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "CPE789",
        veiculoPlaca: "GHI9101",
        dataInicio: new Date("2024-02-15T00:00:00Z"),
        dataFim: null,
        tipoUso: "fixo",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "ACO012",
        veiculoPlaca: "JKL2345",
        dataInicio: new Date("2023-12-20T00:00:00Z"),
        dataFim: new Date("2023-12-25T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "RSO345",
        veiculoPlaca: "MNO6789",
        dataInicio: new Date("2024-03-01T00:00:00Z"),
        dataFim: null,
        tipoUso: "fixo",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "FLI678",
        veiculoPlaca: "PQR1234",
        dataInicio: new Date("2024-03-15T00:00:00Z"),
        dataFim: new Date("2024-03-20T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "DMA890",
        veiculoPlaca: "STU4321",
        dataInicio: new Date("2024-04-01T00:00:00Z"),
        dataFim: null,
        tipoUso: "fixo",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "JME901",
        veiculoPlaca: "VWX8765",
        dataInicio: new Date("2024-05-10T00:00:00Z"),
        dataFim: new Date("2024-05-15T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "BFE123",
        veiculoPlaca: "YZA3456",
        dataInicio: new Date("2024-06-20T00:00:00Z"),
        dataFim: new Date("2024-06-25T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "LRO234",
        veiculoPlaca: "BCD7890",
        dataInicio: new Date("2024-07-05T00:00:00Z"),
        dataFim: new Date("2024-07-10T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "MOL456",
        veiculoPlaca: "EFG0123",
        dataInicio: new Date("2024-08-10T00:00:00Z"),
        dataFim: new Date("2024-08-15T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "ACO012",
        veiculoPlaca: "HIJ4567",
        dataInicio: new Date("2024-09-15T00:00:00Z"),
        dataFim: new Date("2024-09-20T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "FLI678",
        veiculoPlaca: "KLM8901",
        dataInicio: new Date("2024-10-05T00:00:00Z"),
        dataFim: new Date("2024-10-10T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "JME901",
        veiculoPlaca: "NOP2345",
        dataInicio: new Date("2024-11-01T00:00:00Z"),
        dataFim: new Date("2024-11-05T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "BFE123",
        veiculoPlaca: "ABC1234",
        dataInicio: new Date("2025-01-15T00:00:00Z"),
        dataFim: new Date("2025-01-20T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "LRO234",
        veiculoPlaca: "DEF5678",
        dataInicio: new Date("2025-02-10T00:00:00Z"),
        dataFim: new Date("2025-02-15T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "MOL456",
        veiculoPlaca: "GHI9101",
        dataInicio: new Date("2025-03-05T00:00:00Z"),
        dataFim: new Date("2025-03-08T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('historico_utilizacao_veiculos', null, {});
  }
};