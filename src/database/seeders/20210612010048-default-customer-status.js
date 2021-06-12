'use strict';
const { v4:uuidV4 } = require('uuid')


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CustomerStatuses', [
      {
        id: uuidV4(),
        name: 'Pendente de Documentação',
        order: 1,
        key: "DOC_PENDING",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Documentação em Análise',
        order: 2,
        key: "DOC_ANALISIS",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Documentação negada pelo Documentista',
        order: 3,
        key: "DOC_DENIED_DOCUMENTIST",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Documentação negada pela análise bancária',
        order: 4,
        key: "DOC_DENIED_BANK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Documentação aprovada',
        order: 5,
        key: "DOC_APPROVED",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Venda gerada',
        order: 6,
        key: "SALE_GENERATED",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Finalizado',
        order: 7,
        key: "DONE",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CustomerStatuses', null, {});

  }
};
