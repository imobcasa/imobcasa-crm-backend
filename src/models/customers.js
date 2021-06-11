'use strict';
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
    userId: DataTypes.UUID
  }, {});
  Customers.associate = function(models) {
    // associations can be defined here
  };
  return Customers;
};