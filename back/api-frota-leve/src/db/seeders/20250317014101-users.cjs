'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('usuarios', [
      {
        email: 'admin@example.com',
        uidMSK: 'ADM001',
        password: 'adminpass',
        type: 'adm',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@example.com',
        uidMSK: 'USR001',
        password: 'userpass',
        type: 'default',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('usuarios', null);
    
  }
};
