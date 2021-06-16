'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      typeId: {
        type: Sequelize.UUID,
        references: {
          model: "documentTypes",
          key: "id"
        },
        allowNull: false
      },
      statusId: {
        type: Sequelize.UUID,
        references: {
          model: "documentStatuses",
          key: "id"
        },
        allowNull: false
      },
      size: {
        type: Sequelize.NUMBER
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: "Customers",
          key: "id"
        },
        allowNull: false
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
    return queryInterface.dropTable('documents');
  }
};