const Service = require('../Service')
const { SalesRepository, UsersSalesRepository } = require('../../repositories')

class UserService extends Service {
  _getOneRequiredFields = ["x-customer-id", "reqUserId", "admin"]
  _createRequiredFields = [ 
    "customerId",
    "projectName",
    "unityName",
    "tower",
    "value",
    "observations",
    "usersIds"
   ]

  constructor(){
    super()
    this._salesRepository = new SalesRepository()
    this._usersSalesRepository = new UsersSalesRepository()
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
    sale.users = users

    return sale
  }


  async create(fields){
    this._checkRequiredFields(this._createRequiredFields, fields)

    return {}
  }
  

}

module.exports = UserService