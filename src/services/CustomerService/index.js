const Service = require('../Service')
const { CustomerRepository } = require('../../repositories')


class CustomerService extends Service {

  _listRequiredFields = ['x-status', 'reqUserId', 'admin']
  

  constructor(){
    super()
    this._customerRepository = new CustomerRepository()
  }


  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    await this._checkFieldExists(fields['x-status'], 'x-status')
    
    

    return []
  }

}

module.exports = CustomerService