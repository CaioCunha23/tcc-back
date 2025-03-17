'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('colaboradores', [
      {
        nome: "João da Silva",
        status: "Ativo",
        email: "joao.silva@example.com",
        uidMSK: "JSI123",
        localidade: "SSZ",
        brand: "Maersk Brasil",
        jobTitle: "Motorista",
        cpf: "12345678901",
        usaEstacionamento: true,
        cidadeEstacionamento: "Santos",
        cnh: "CNH123456",
        tipoCNH: "A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Maria Oliveira",
        status: "Ativo",
        email: "maria.oliveira@example.com",
        uidMSK: "MOL456",
        localidade: "SPO",
        brand: "Aliança",
        jobTitle: "Administradora",
        cpf: "23456789012",
        usaEstacionamento: false,
        cidadeEstacionamento: null,
        cnh: "CNH234567",
        tipoCNH: "B",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Carlos Pereira",
        status: "Ativo",
        email: "carlos.pereira@example.com",
        uidMSK: "CPE789",
        localidade: "SSZ",
        brand: "Maersk Brasil",
        jobTitle: "Analista",
        cpf: "34567890123",
        usaEstacionamento: true,
        cidadeEstacionamento: "São Paulo",
        cnh: "CNH345678",
        tipoCNH: "AB",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Ana Costa",
        status: "Ativo",
        email: "ana.costa@example.com",
        uidMSK: "ACO012",
        localidade: "SPO",
        brand: "Aliança",
        jobTitle: "Gerente",
        cpf: "45678901234",
        usaEstacionamento: false,
        cidadeEstacionamento: null,
        cnh: "CNH456789",
        tipoCNH: "C",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Roberto Souza",
        status: "Ativo",
        email: "roberto.souza@example.com",
        uidMSK: "RSO345",
        localidade: "SSZ",
        brand: "Maersk Brasil",
        jobTitle: "Técnico",
        cpf: "56789012345",
        usaEstacionamento: true,
        cidadeEstacionamento: "Santos",
        cnh: "CNH567890",
        tipoCNH: "D",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('colaboradores', null);

  }
};
