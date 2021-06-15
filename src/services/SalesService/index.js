const Service = require('../Service')
const { SalesRepository, UsersSalesRepository, CustomerRepository, UserRepository } = require('../../repositories')
const { SearchSource } = require('@jest/core')

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

  constructor(){
    super()
    this._salesRepository = new SalesRepository()
    this._usersSalesRepository = new UsersSalesRepository()
    this._customersRespository =  new CustomerRepository()
    this._usersRepository = new UserRepository()
  }


  async getSale(fields){
    
    this._checkRequiredFields(this._getOneRequiredFields, fields)

    const customerId = fields['x-customer-id']

    const sale = await this._salesRepository.getSaleByCustomerId({customerId})
    this._checkEntityExsits(sale, 'x-customer-id')

    const usersSales = await this._usersSalesRepository.getUsersSalesBySaleId({saleId: sale.id})
    
    const users = usersSales.map(userSale => {
      return {
        id: userSale.userId,
        fullName: userSale.user.fullName,
        username: userSale.user.username,
      }
    })
    // sale.users = users



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


  async create(fields){
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

    for(const userId of usersIds){
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
    for(const userId of usersIds){
      const userSale = await this._usersSalesRepository.create({
        userId,
        saleId: sale.id
      })
      usersSales.push(userSale)
    }

    return sale
  }
  

  async update(fields){
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
      await this._salesRepository.getOne({id}), 
      "id"
    )

    for(const userId of usersIds){
      const user = await this._usersRepository.getOne({
        id: userId
      })
      this._checkEntityExsits(user, "usersIds")
    }

    
    for(const userId of usersIds){
      const userSaleToUpdate = await this._usersSalesRepository.getUserSaleBySaleAndUserId({
        saleId: id,
        userId
      })
      await this._usersSalesRepository.update({
        id: userSaleToUpdate.id,
        userId
      })
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

  async delete(fields){
    this._checkRequiredFields(this._deleteRequiredFields, fields)

    this._checkEntityExsits(
      await this._salesRepository.getOne({ id: fields['x-sale-id'] }),
      'x-sale-id'
    )

    await this._usersSalesRepository.delete({
      id: fields['x-sale-id']
    })
    

    return await this._salesRepository.delete({ id: fields['x-sale-id']})
  }

}

module.exports = UserService
