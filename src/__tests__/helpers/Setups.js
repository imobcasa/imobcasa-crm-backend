const { Users, Customers, Profiles, CustomerStatuses } = require('../../models')
const Mocks = require('./Mocks')
const mocks = new Mocks()


class Setup {

  async generateProfile(name = "Administrador", admin = false, teamManager = false) {
    return await Profiles.create(mocks.mockProfile("Administrador", admin, teamManager))
  }

  async generateUser(username = "mockedUser", profileId, managerId) {
    return await Users.create(mocks.mockUser("mockedUser", profileId))
  }

  async generateCustomerStaus(name, order, key) {
    return await CustomerStatuses.create(mocks.mockCustomerStatus(name, order, key))
  }

  async generateCustomer(userId, customerStatusId) {
    return await Customers.create(mocks.mockCustomer(userId, customerStatusId))
  }

}

module.exports = Setup