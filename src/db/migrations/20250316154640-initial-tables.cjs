'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

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
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
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
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default'
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
      resetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetExpires: {
        type: Sequelize.DATE,
        allowNull: true,
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
      renavam: {
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
      perfil: {
        type: Sequelize.STRING,
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

    await queryInterface.createTable('historico_utilizacao_veiculos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      colaboradorUid: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
          model: 'colaboradores',
          key: 'uidMSK'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      veiculoPlaca: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'veiculos',
          key: 'placa'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      dataInicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dataFim: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tipoUso: {
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

    await queryInterface.createTable('infracoes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      colaboradorUid: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
          model: 'colaboradores',
          key: 'uidMSK'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      placaVeiculo: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'veiculos',
          key: 'placa'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      costCenter: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataInfracao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hora: {
        type: Sequelize.STRING,
        allowNull: true
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      prefixo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: true
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rodovia: {
        type: Sequelize.STRING,
        allowNull: true
      },
      praca: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dataEnvio: {
        type: Sequelize.DATE,
        allowNull: true
      },
      codigoMulta: {
        type: Sequelize.STRING,
        allowNull: true
      },
      indicacaoLimite: {
        type: Sequelize.STRING,
        allowNull: true
      },
      statusResposta: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reconhecimento: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      enviadoParaRH: {
        type: Sequelize.BOOLEAN,
        allowNull: true
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
    await queryInterface.dropTable('infracoes');
    await queryInterface.dropTable('historico_utilizacao_veiculos');
    await queryInterface.dropTable('veiculos');
    await queryInterface.dropTable('colaboradores');
  }
};