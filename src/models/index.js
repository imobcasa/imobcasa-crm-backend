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
    Users: sequelize.import("./users"),
    Profiles: sequelize.import("./profiles"),
    Customers: sequelize.import("./customers"),
    CustomerStatuses: sequelize.import("./customerstatus"),
    Sales: sequelize.import("./sales"),
    UsersSales: sequelize.import("./userssales")
}

db.Users.belongsTo(db.Profiles, {
    foreignKey: 'profileId',
    targetKey: 'id',
    as: 'profile'
})

db.Users.hasMany(db.Customers, {
    onDelete: 'SET NULL'
})

db.Customers.belongsTo(db.Users, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
})

db.Customers.belongsTo(db.CustomerStatuses, {
    foreignKey: 'statusId',
    targetKey: 'id',
    as: 'status'
})

db.Customers.hasOne(db.Sales, {
    onDelete: 'CASCADE'
})

db.Sales.belongsTo(db.Customers, {
    foreignKey: 'customerId',
    targetKey: 'id',
    as: 'customer'
})

db.Sales.hasMany(db.UsersSales, {
    onDelete: 'CASCADE'
})

db.UsersSales.belongsTo(db.Users, {
    foreignKey: 'userId',
    targetKey: "id",
    as: 'user'
})

db.UsersSales.belongsTo(db.Sales, {
    foreignKey: 'saleId',
    targetKey: "id",
    as: 'sale'
})


Object.keys(db).forEach(model => {
    if ("associate" in db[model]) {
        db[model].associate(db)
    }
})

module.exports = db
