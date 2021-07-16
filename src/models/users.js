'use strict';
var bcrypt = require('bcryptjs');
const path = require('path')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('Users', { 
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    profileId: DataTypes.UUID,
    managerId: DataTypes.STRING,    
    password: DataTypes.STRING,
  }, {
    freezeTableName: true,
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(user.password, salt)
        user.id = uuidV4()
      },           
    },    
    
  });
  user.prototype.validPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password)
  }

  user.prototype.generatePasswordHash = async function (password) {
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(password, salt)
  }

  user.associate = function (models) {
    // associations can be defined here

    

  };

  
  return user;
};
