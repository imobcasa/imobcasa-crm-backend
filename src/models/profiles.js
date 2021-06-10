'use strict';
const { v4: uuidV4 } = require('uuid')


module.exports = (sequelize, DataTypes) => {
  const Profiles = sequelize.define('Profiles', {
    name: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    teamManager: DataTypes.BOOLEAN,
  }, {
    hooks: {
      beforeCreate: profile => {
        profile.id = uuidV4()
      }
    }
  });
  Profiles.associate = function(models) {
    // associations can be defined here
  };
  return Profiles;
};