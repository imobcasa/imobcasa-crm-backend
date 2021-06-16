'use strict';
const { v4: uuidV4 } = require('uuid')

 (sequelize, DataTypes) => {
  const documentTypes = sequelize.define('documentTypes', {
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    providedByCustomer: DataTypes.BOOLEAN
  }, {
    beforeCreate: (documentType) => {
      documentType.id = uuidV4()
    }
  });
  documentTypes.associate = function(models) {
    // associations can be defined here
  };
  return documentTypes;
};