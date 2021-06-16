'use strict';
const { v4: uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('documentTypes', [
      {
        id: uuidV4(),
        name: 'Ficha',
        providedByCustomer: true,
        key: "FORM_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'RG',
        providedByCustomer: true,
        key: "RG_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Certidão de estado civíl',
        providedByCustomer: true,
        key: "CIVIL_STATUS_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovante de renda',
        providedByCustomer: true,
        key: "INCOMES_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovante de endereço',
        providedByCustomer: true,
        key: "",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Carteira de trabalho',
        providedByCustomer: true,
        key: "WORK_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Extrato FGTS',
        providedByCustomer: true,
        key: "FGTS_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Imposto de renda',
        providedByCustomer: true,
        key: "INCOMES_DECLARATION_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovação de dependentes',
        providedByCustomer: true,
        key: "DEPENDENTS_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Outros',
        providedByCustomer: true,
        key: "OTHER_DOC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovante comissão corretor',
        key: "BROKER_COMMISSION_VOUCHER_DOC",
        providedByCustomer: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('documentTypes', null, {});

  }
};


