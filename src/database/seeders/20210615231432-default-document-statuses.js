'use strict';
const { v4: uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('documentStatuses', [
      {
        id: uuidV4(),
        name: 'Em análise',
        order: 1,
        key: "ANALISIS",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Negado pelo documentista',
        order: 2,
        key: "DENIED_DOCUMENTIST",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Negado pela análise bancária',
        order: 3,
        key: "DENIED_BANK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Aprovado',
        order: 4,
        key: "APPROVED",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Reprovado',
        order: 5,
        key: "DENIED",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
