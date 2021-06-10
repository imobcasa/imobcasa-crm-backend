const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})

module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_development",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": "database.sqlite",
    "operatorsAliases": "0",
    "logging": true
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_test",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": "database.test.sqlite",
    "operatorsAliases": "0",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "operatorsAliases": "0",
    "logging": false,
    "dialectOptions": {
      "options": {
        "requestTimeout": 3000
      },
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
