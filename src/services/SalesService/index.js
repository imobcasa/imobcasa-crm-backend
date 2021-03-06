const Service = require('../Service')
const { 
  SalesRepository,
  UsersSalesRepository,
  CustomerRepository,
  UserRepository,
  ProfilesRepository,
  CustomerStatusesRepository,
 } = require('../../repositories')

class UserService extends Service {
  _getOneRequiredFields = ["x-customer-id", "reqUserId", "admin"]
  _deleteRequiredFields = ["x-sale-id"]
  _createRequiredFields = [
    "customerId",
    "projectName",
    "unityName",
    "tower",
    "value",
    "observations",
    "usersIds"
  ]
  _updateRequiredFields = [
    "projectName",
    "unityName",
    "tower",
    "value",
    "observations",
    "usersIds",
    "id"
  ]

  constructor() {
    super()
    this._salesRepository = new SalesRepository()
    this._usersSalesRepository = new UsersSalesRepository()
    this._customersRespository = new CustomerRepository()
    this._usersRepository = new UserRepository()
    this._profilesRepository = new ProfilesRepository()
    this._customerStatusesRepository = new CustomerStatusesRepository()

  }

  async _getManagers(users = []) {
    const usersWithManagers = []
    for (const user of users) {
      const userData = await this._usersRepository.getOne({ id: user.id })
      if (userData.managerId) {
        const manager = await this._usersRepository.getOne({ id: userData.managerId })
        user.manager = {
          fullName: manager.fullName,
          id: manager.id
        }
      }
      usersWithManagers.push(user)
    }

    return usersWithManagers
  }

  async _updateCustomerStatusByStatusKey(customerId, statusKey){
    const customerNewStatus = await this._customerStatusesRepository.getStatusByKey(statusKey)
    if(customerNewStatus){
      return await this._customersRespository.updateStatus({ 
        statusId: customerNewStatus.id,
        customerId: customerId
      })
    }    
  }


  async getSale(fields) {

    this._checkRequiredFields(this._getOneRequiredFields, fields)

    const customerId = fields['x-customer-id']
    const customer = await this._customersRespository.getOne({ id: customerId })
    this._checkEntityExsits(customer, 'x-customer-id')

    const sale = await this._salesRepository.getSaleByCustomerId({ customerId })
    if (!sale) {
      return {}
    }

    const usersSales = await this._usersSalesRepository.getUsersSalesBySaleId({ saleId: sale.id })

    const users = usersSales.map(userSale => {
      return {
        id: userSale.userId,
        fullName: userSale.user.fullName,
        username: userSale.user.username
      }
    })

    const usersWithManagers = await this._getManagers(users)



    return {
      id: sale.id,
      customerId: sale.customerId,
      projectName: sale.projectName,
      unityName: sale.unityName,
      tower: sale.tower,
      value: parseFloat(sale.value),
      observations: sale.observations,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      users
    }
  }

  async create(fields) {
    this._checkRequiredFields(this._createRequiredFields, fields)

    const {
      customerId,
      projectName,
      unityName,
      tower,
      value,
      observations,
      usersIds
    } = fields


    const customer = await this._customersRespository.getOne({
      id: customerId
    })
    this._checkEntityExsits(customer, "customerId")

    for (const userId of usersIds) {
      const user = await this._usersRepository.getOne({
        id: userId
      })
      this._checkEntityExsits(user, "usersIds")
    }






    const sale = await this._salesRepository.create({
      customerId,
      projectName,
      unityName,
      tower,
      value,
      observations
    })

    let usersSales = []
    for (const userId of usersIds) {
      const userSale = await this._usersSalesRepository.create({
        userId,
        saleId: sale.id
      })
      usersSales.push(userSale)
    }

    await this._updateCustomerStatusByStatusKey(customerId, "SALE_GENERATED")

    return sale
  }

  async update(fields) {
    this._checkRequiredFields(this._updateRequiredFields, fields)

    const {
      id,
      projectName,
      unityName,
      tower,
      value,
      observations,
      usersIds
    } = fields


    this._checkEntityExsits(
      await this._salesRepository.getOne({ id }),
      "id"
    )

    for (const userId of usersIds) {
      const user = await this._usersRepository.getOne({
        id: userId
      })
      this._checkEntityExsits(user, "usersIds")
    }



    if (usersIds.length > 1) {
      const usersSalesIds = await this._usersSalesRepository.findUsersSalesIdsBySaleId({
        saleId: id,
      })

      if (usersSalesIds.length === 1) {
        await this._usersSalesRepository.update({
          id: usersSalesIds[0].id,
          userId: usersIds[0]
        })

        await this._usersSalesRepository.create({
          saleId: id,
          userId: usersIds[1],
        })
      }

      if (usersSalesIds.length > 1) {        
        await this._usersSalesRepository.update({
          userId: usersIds[0],
          id: usersSalesIds[0].id
        })

        await this._usersSalesRepository.update({
          userId: usersIds[1],
          id: usersSalesIds[1].id
        })
      }
    }

    if (usersIds.length === 1) {

      const usersSalesIds = await this._usersSalesRepository.findUsersSalesIdsBySaleId({
        saleId: id,
      })

      if(usersSalesIds.length > 1){
        await this._usersSalesRepository.destroyBySaleId({
          saleId: id,
        })

        await this._usersSalesRepository.create({
          userId: usersIds[0],
          saleId: id
        })
      }

      if(usersSalesIds.length === 1){
        await this._usersSalesRepository.update({
          id: usersSalesIds[0].id,
          userId: usersIds[0],
        })
      }
    }


    return await this._salesRepository.update({
      id,
      projectName,
      unityName,
      tower,
      value,
      observations
    })
  }

  async delete(fields) {
    this._checkRequiredFields(this._deleteRequiredFields, fields)

    const sale = await this._salesRepository.getOne({ id: fields['x-sale-id'] })

    this._checkEntityExsits(
      sale,
      'x-sale-id'
    )

    await this._usersSalesRepository.delete({
      id: fields['x-sale-id']
    })

    await this._updateCustomerStatusByStatusKey(sale.customerId, "DOC_APPROVED")

    return await this._salesRepository.delete({ id: fields['x-sale-id'] })
  }

  async getUsersAvailable() {
    const sellerProfile = await this._profilesRepository.getSellerProfile()
    return await this._usersRepository.usersForSales(sellerProfile.id)
  }

}

module.exports = UserService
