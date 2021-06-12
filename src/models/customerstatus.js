'use strict';
const { v4: uuidV4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const CustomerStatus = sequelize.define('CustomerStatus', {
    name: DataTypes.STRING,
    order: DataTypes.NUMBER,
    key: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (customerStatus) => {
        customerStatus.id = uuidV4()
      }
    },
  });
  CustomerStatus.associate = function(models) {
    // associations can be defined here
  };
  return CustomerStatus;
};