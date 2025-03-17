'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      uidMSK: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.createTable('colaboradores', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Ativo'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      uidMSK: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true
      },
      localidade: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jobTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
      },
      usaEstacionamento: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      cidadeEstacionamento: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cnh: {
        type: Sequelize.STRING(9),
        allowNull: false
      },
      tipoCNH: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.createTable('veiculos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      fornecedor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contrato: {
        type: Sequelize.STRING,
        allowNull: false
      },
      placa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      renavan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      chassi: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cliente: {
        type: Sequelize.STRING,
        allowNull: false
      },
      uidMSK: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
          model: 'colaboradores',
          key: 'uidMSK'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      perfil: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jobLevel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descricaoCargo: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      centroCusto: {
        type: Sequelize.STRING,
        allowNull: false
      },
      franquiaKM: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      carroReserva: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      dataDisponibilizacao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      mesesContratados: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      previsaoDevolucao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      mesesFaltantes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mensalidade: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      budget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      multa: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      proximaRevisao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('veiculos');
    await queryInterface.dropTable('colaboradores');
    await queryInterface.dropTable('usuarios');
  }
};