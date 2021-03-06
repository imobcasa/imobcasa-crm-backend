'use strict';
const { v4: uuidV4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('documents', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    key: DataTypes.STRING,
    typeId: DataTypes.UUID,
    statusId: DataTypes.UUID,
    size: DataTypes.NUMBER,
    customerId: DataTypes.UUID,
    comments: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: (document) => {
        document.id = uuidV4()
      }
    }
  });
  documents.associate = function(models) {
    // associations can be defined here
  };
  return documents;
};
