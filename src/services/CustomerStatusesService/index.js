const Service = require('../Service')
const { CustomerStatusesRepository } = require('../../repositories')

class CustomerStatusesService extends Service {

  constructor(){
    super()
    this._customerStatusesRepository = new CustomerStatusesRepository()
  }


  async listAll(fields){
    const { profile } = fields
    return await this._customerStatusesRepository.listAll({
      profileName: profile.name.toUpperCase()
    })
  }


}

module.exports = CustomerStatusesService
