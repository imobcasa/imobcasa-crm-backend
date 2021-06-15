'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    customerId: DataTypes.UUID,
    userId: DataTypes.UUID,
    projectName: DataTypes.STRING,
    unityName: DataTypes.STRING,
    tower: DataTypes.STRING,
    value: DataTypes.STRING,
    managerId: DataTypes.STRING,
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