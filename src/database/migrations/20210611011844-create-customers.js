'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
      cpf: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATE
      },
      incomes: {
        type: Sequelize.NUMBER
      },
      startDate: {
        type: Sequelize.DATE
      },
      origin: {
        type: Sequelize.STRING
      },
      productInterest: {
        type: Sequelize.STRING
      },
      regionInterest: {
        type: Sequelize.STRING
      },
      biddersQuatity: {
        type: Sequelize.NUMBER
      },
      userId: {
        type: Sequelize.UUID,
        refernces: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Customers');
  }
};