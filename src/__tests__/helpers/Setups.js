const { Users, Customers, Profiles, CustomerStatuses, Sales, UsersSales } = require('../../models')
const Mocks = require('./Mocks')
const mocks = new Mocks()
const databaseSetup = require('../../database')


class Setup {

  async generateProfile(name = "Administrador", admin = false, teamManager = false, raw = false) {
    return await Profiles.create(mocks.mockProfile(name, admin, teamManager), { raw })
  }

  async generateUser(username = "mockedUser", profileId, managerId, raw = false) {
    return await Users.create(mocks.mockUser(username, profileId, managerId), { raw })
  }

  async generateCustomerStatus(name, order, key, raw = false) {
    return await CustomerStatuses.create(mocks.mockCustomerStatus(name, order, key), { raw })
  }

  async generateCustomer(userId, customerStatusId, raw = false) {
    return await Customers.create(mocks.mockCustomer(userId, customerStatusId), { raw })
  }

  async generateSale(customerId, usersId = []){
    const sale = await Sales.create(mocks.mockSale(customerId))
    const usersSales = []
    for(const id of usersId){
      const userSale = await UsersSales.create(mocks.mockUsersSales(id, sale.id))
      usersSales.push(userSale)
    }

    return {
      sale,
      usersSales
    }
  }

  async databaseSetup(){
    await databaseSetup()
  }

  async destroyProfiles(){
    await Profiles.destroy({where: {}})
  }

  async destroyUsers(){
    await Users.destroy({where: {}})
  }

  async destroyCustomerStatuses(){
    await CustomerStatuses.destroy({where: {}})
  }

  async destroyCustomers(){
    await Customers.destroy({where: {}})
  }


  async destroySales(){
    await UsersSales.destroy({ where: {}})
    await Sales.destroy({ where: {}})
  }

}

module.exports = Setup