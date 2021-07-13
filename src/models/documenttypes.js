'use strict';
const { v4: uuidV4 } = require('uuid')

 module.exports = (sequelize, DataTypes) => {
  const documentTypes = sequelize.define('documentTypes', {
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    providedByCustomer: DataTypes.BOOLEAN,
    required: DataTypes.BOOLEAN,
  }, {
    hooks: {
      beforeCreate: (documentType) => {
        documentType.id = uuidV4()
      }
    }
  });
  documentTypes.associate = function(models) {
    // associations can be defined here
  };
  return documentTypes;
};