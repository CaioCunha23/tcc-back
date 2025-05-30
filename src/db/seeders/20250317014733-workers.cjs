'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const colaboradores = [
      {
        nome: "João da Silva",
        status: 1,
        email: "joao.silva@example.com",
        uidMSK: "JSI123",
        password: "senha123",
        type: "default",
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
        status: 1,
        email: "maria.oliveira@example.com",
        uidMSK: "MOL456",
        password: "senha123",
        type: "default",
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
        status: 1,
        email: "carlos.pereira@example.com",
        uidMSK: "CPE789",
        password: "senha123",
        type: "default",
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
        status: 1,
        email: "ana.costa@example.com",
        uidMSK: "ACO012",
        password: "senha123",
        type: "default",
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
        status: 1,
        email: "roberto.souza@example.com",
        uidMSK: "RSO345",
        password: "senha123",
        type: "default",
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
      },
      {
        nome: "Fernanda Lima",
        status: 1,
        email: "fernanda.lima@example.com",
        uidMSK: "FLI678",
        password: "senha123",
        type: "default",
        localidade: "SPO",
        brand: "Maersk Brasil",
        jobTitle: "Coordenadora",
        cpf: "67890123456",
        usaEstacionamento: false,
        cidadeEstacionamento: null,
        cnh: "CNH678901",
        tipoCNH: "B",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Diego Matos",
        status: 1,
        email: "diego.matos@example.com",
        uidMSK: "DMA890",
        password: "senha123",
        type: "default",
        localidade: "SPO",
        brand: "Aliança",
        jobTitle: "Supervisor",
        cpf: "78901234567",
        usaEstacionamento: true,
        cidadeEstacionamento: "Salvador",
        cnh: "CNH789012",
        tipoCNH: "C",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Juliana Mendes",
        status: 1,
        email: "juliana.mendes@example.com",
        uidMSK: "JME901",
        password: "senha123",
        type: "default",
        localidade: "SSZ",
        brand: "Maersk Brasil",
        jobTitle: "Engenheira",
        cpf: "89012345678",
        usaEstacionamento: false,
        cidadeEstacionamento: null,
        cnh: "CNH890123",
        tipoCNH: "AB",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Bruno Ferreira",
        status: 1,
        email: "bruno.ferreira@example.com",
        uidMSK: "BFE123",
        password: "senha123",
        type: "default",
        localidade: "SSZ",
        brand: "Aliança",
        jobTitle: "Estagiário",
        cpf: "90123456789",
        usaEstacionamento: true,
        cidadeEstacionamento: "Salvador",
        cnh: "CNH901234",
        tipoCNH: "A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: "Larissa Rocha",
        status: 1,
        email: "larissa.rocha@example.com",
        uidMSK: "LRO234",
        password: "senha123",
        type: "default",
        localidade: "SPO",
        brand: "Maersk Brasil",
        jobTitle: "Desenvolvedora",
        cpf: "01234567890",
        usaEstacionamento: true,
        cidadeEstacionamento: "São Paulo",
        cnh: "CNH012345",
        tipoCNH: "B",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const c of colaboradores) {
      c.password = await bcrypt.hash(c.password, 10);
      c.createdAt = new Date();
      c.updatedAt = new Date();
    }

    await queryInterface.bulkInsert('colaboradores', colaboradores);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('colaboradores', null, {});
  }
};