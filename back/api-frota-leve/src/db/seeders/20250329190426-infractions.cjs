'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('infracoes', [
      {
        tipo: "sem parar",
        placa: "ABC1234",
        colaboradorUid: "JSI123",
        veiculoId: 1,
        costCenter: "Centro 1",
        dataInfracao: new Date("2025-03-15T00:00:00Z"),
        tag: "TAG001",
        hora: "08:30",
        valor: 50.00,
        prefixo: "PFX001",
        marca: "Marca A",
        categoria: "Categoria A",
        rodovia: "Rodovia 1",
        praca: "Praça 1",
        nome: "João da Silva",
        dataEnvio: null,
        codigoMulta: null,
        indicacaoLimite: null,
        statusResposta: null,
        reconhecimento: null,
        enviadoParaRH: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo: "multa",
        placa: "DEF5678",
        colaboradorUid: "MOL456",
        veiculoId: 2,
        costCenter: "Centro 2",
        dataInfracao: new Date("2025-04-10T00:00:00Z"),
        tag: null,
        hora: null,
        valor: 200.00,
        prefixo: null,
        marca: null,
        categoria: null,
        rodovia: null,
        praca: null,
        nome: "Maria Oliveira",
        dataEnvio: new Date("2025-04-11T00:00:00Z"),
        codigoMulta: "MULTA001",
        indicacaoLimite: "Sim",
        statusResposta: "Pendente",
        reconhecimento: false,
        enviadoParaRH: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('infracoes', null, {});
  }
};