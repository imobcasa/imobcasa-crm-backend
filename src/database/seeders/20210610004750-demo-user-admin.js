'use strict';
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Users', [{
    id: uuidV4(),
    fullName: "Administrador",
    username: 'admin',
    email: 'admin@mail.com',
    phone: '11912341234',
    profileId: '0d3ae5f0-0dd3-456e-ab82-3423abed9d96',
    managerId: null,
    password: bcrypt.hashSync("admin", salt),
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
