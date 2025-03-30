'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('historico_utilizacao_veiculos', [
      {
        colaboradorUid: "JSI123",
        veiculoId: 1,
        dataInicio: new Date("2025-03-05T00:00:00Z"),
        dataFim: new Date("2025-03-10T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "MOL456",
        veiculoId: 2,
        dataInicio: new Date("2025-04-10T00:00:00Z"),
        dataFim: null,
        tipoUso: "permanente",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "CPE789",
        veiculoId: 3,
        dataInicio: new Date("2025-05-05T00:00:00Z"),
        dataFim: new Date("2025-05-15T00:00:00Z"),
        tipoUso: "temporário",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "ACO012",
        veiculoId: 4,
        dataInicio: new Date("2025-06-05T00:00:00Z"),
        dataFim: null,
        tipoUso: "permanente",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        colaboradorUid: "RSO345",
        veiculoId: 5,
        dataInicio: new Date("2025-07-05T00:00:00Z"),
        dataFim: new Date("2025-07-15T00:00:00Z"),
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