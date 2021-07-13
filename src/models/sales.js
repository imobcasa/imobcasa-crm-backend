'use strict';

const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    customerId: DataTypes.UUID,
    projectName: DataTypes.STRING,
    unityName: DataTypes.STRING,
    tower: DataTypes.STRING,
    value: DataTypes.REAL,
    observations: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (sale) => {
        sale.id = uuidV4()
      }
    },
  });
  Sales.associate = function(models) {
    // associations can be defined here
  };
  return Sales;
};
