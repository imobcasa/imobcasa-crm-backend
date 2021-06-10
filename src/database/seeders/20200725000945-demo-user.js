'use strict';
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('users', [{
    id: uuidV4(),
    username: 'admin',
    fullName: 'Admin',
    admin: true,
    email: 'admin@mail.com',
    password: bcrypt.hashSync("admin", salt),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('users', null, {});
  }
};
