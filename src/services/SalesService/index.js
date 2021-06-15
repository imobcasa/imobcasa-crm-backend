const Service = require('../Service')
const { SalesRepository, UsersSalesRepository } = require('../../repositories')

class UserService extends Service {
  _getOneRequiredFields = ["x-sale-id", "reqUserId", "admin"]

  constructor(){
    super()
    this._salesRepository = new SalesRepository()
    this._usersSalesRepository = new UsersSalesRepository()
  }


  async getSale(fields){
    
    this._checkRequiredFields(this._getOneRequiredFields, fields)

    return {}
  }

  

}

module.exports = UserService