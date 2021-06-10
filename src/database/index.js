const {Sequelize}  = require('sequelize')
const config = require('./config').database
const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
const Umzug = require('umzug')
const { migrationsConfig, seedConfig } = require('./config').migrations



const env = (process.env.NODE_ENV || 'development').trim()

async function database(){
  try{
    const sequelize = new Sequelize(config[env]) 
    const migrator = new Umzug(migrationsConfig(Sequelize, sequelize))
    const seeder = new Umzug(seedConfig(Sequelize, sequelize))
    
    await migrator.up()
    await seeder.up()
    
  }catch(err){
    console.log(err)
  }
}

module.exports = database