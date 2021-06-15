const Service = require('../Service')
const { SalesRepository, UsersSalesRepository } = require('../../repositories')

class UserService extends Service {
  _getOneRequiredFields = []

  constructor(){
    super()
    this._salesRepository = new SalesRepository()
    this._usersSalesRepository = new UsersSalesRepository()
  }


  async getSale(fields){


    return {}
  }

  

}

module.exports = UserService