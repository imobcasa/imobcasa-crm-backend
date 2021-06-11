const { Sequelize } = require('sequelize');
const env = (process.env.NODE_ENV || 'development').trim()
const config = require('../database/config').database[env]
const { database, username, password, ...restConfig } = config
const sequelize = new Sequelize(
  database,
  username, 
  password,
  restConfig
  )
const db = {
    Sequelize: Sequelize,
    sequelize,
    User: sequelize.import("./users"),
    Profile: sequelize.import("./profiles"),
    Customer: sequelize.import("./customers")
}

db.User.belongsTo(db.Profile, {
    foreignKey: 'profileId',
    targetKey: 'id',
    as: 'profile'
})

db.Customer.belongsTo(db.User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
})

db.User.hasMany(db.Customer, {
    onDelete: 'CASCADE'
})

Object.keys(db).forEach(model => {
    if ("associate" in db[model]) {
        db[model].associate(db)
    }
})

module.exports = db
