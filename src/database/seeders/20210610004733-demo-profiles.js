'use strict';
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Profiles', [
      {
        id: uuidV4(),
        name: 'Corretor',
        admin: false,
        teamManager: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Financeiro',
        admin: false,
        teamManager: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Documentista',
        admin: false,
        teamManager: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Gestor',
        admin: false,
        teamManager: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "0d3ae5f0-0dd3-456e-ab82-3423abed9d96",
        name: 'Administrador',
        admin: true,
        teamManager: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Profiles', null, {});

  }
};
