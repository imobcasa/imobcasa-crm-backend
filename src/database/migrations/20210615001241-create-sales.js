'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: "Customers",
          key: "id"
        },
        allowNull: false
      },
      projectName: {
        type: Sequelize.STRING
      },
      unityName: {
        type: Sequelize.STRING
      },
      tower: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.REAL
      },
      observations: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Sales');
  }
};