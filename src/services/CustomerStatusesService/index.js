const Service = require('../Service')
const { CustomerStatusesRepository } = require('../../repositories')

class CustomerStatusesService extends Service {

  constructor(){
    super()
    this._customerStatusesRepository = new CustomerStatusesRepository()
  }


  async listAll(){
    return await this._customerStatusesRepository.listAll()
  }


}

module.exports = CustomerStatusesService
