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
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'RG',
        providedByCustomer: true,
        key: "RG_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Certidão de estado civíl',
        providedByCustomer: true,
        key: "CIVIL_STATUS_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovante de renda',
        providedByCustomer: true,
        key: "INCOMES_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovante de endereço',
        providedByCustomer: true,
        key: "ADDRESS_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Carteira de trabalho',
        providedByCustomer: true,
        key: "WORK_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Extrato FGTS',
        providedByCustomer: true,
        key: "FGTS_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Imposto de renda',
        providedByCustomer: true,
        key: "INCOMES_DECLARATION_DOC",
        required: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovação de dependentes',
        providedByCustomer: true,
        key: "DEPENDENTS_DOC",
        required: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Outros',
        providedByCustomer: true,
        key: "OTHER_DOC",
        required: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Comprovante comissão corretor',
        key: "BROKER_COMMISSION_VOUCHER_DOC",
        providedByCustomer: false,
        required: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('documentTypes', null, {});

  }
};


