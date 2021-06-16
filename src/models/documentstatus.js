'use strict';
const { v4: uuidV4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const documentStatus = sequelize.define('documentStatus', {
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    order: DataTypes.NUMBER
  }, {
    beforeCreate: (documentStatus) => {
      documentStatus.id = uuidV4()
    }
  });
  documentStatus.associate = function(models) {
    // associations can be defined here
  };
  return documentStatus;
};