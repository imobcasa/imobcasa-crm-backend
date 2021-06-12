'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerStatus = sequelize.define('CustomerStatus', {
    name: DataTypes.STRING,
    order: DataTypes.NUMBER,
    key: DataTypes.STRING
  }, {});
  CustomerStatus.associate = function(models) {
    // associations can be defined here
  };
  return CustomerStatus;
};