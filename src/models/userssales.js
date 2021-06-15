'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersSales = sequelize.define('UsersSales', {
    userId: DataTypes.UUID,
    saleId: DataTypes.UUID
  }, {
    hooks: {
      beforeCreate: (userssales) => {
        userssales.id = uuidV4()
      }
    }
  });
  UsersSales.associate = function(models) {
    // associations can be defined here
  };
  return UsersSales;
};