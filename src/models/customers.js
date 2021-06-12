'use strict';
const { v4: uuidV4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define('Customers', {
    fullName: DataTypes.STRING,
    cpf: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    incomes: DataTypes.NUMBER,
    startDate: DataTypes.DATE,
    origin: DataTypes.STRING,
    productInterest: DataTypes.STRING,
    regionInterest: DataTypes.STRING,
    biddersQuatity: DataTypes.NUMBER,
    userId: DataTypes.UUID,
    statusId: DataTypes.UUID
  }, {
    hooks: {
      beforeCreate: (customer) => {
        customer.id = uuidV4()
      }
    },
  });
  Customers.associate = function(models) {
    // associations can be defined here
  };
  return Customers;
};