const Service = require('../Service')
const { CustomerRepository, CustomerStatusesRepository } = require('../../repositories')


class CustomerService extends Service {

  _listRequiredFields = ['x-status', 'reqUserId', 'admin']
  

  constructor(){
    super()
    this._customerRepository = new CustomerRepository()
    this._customerStatusesRepository = new CustomerStatusesRepository()
  }


  _checkStatusesProvided(statuses = [], validStatuses = []){

    for(const status of statuses){
      if(!validStatuses.includes(status)){
        this._throwInvalidParamError('x-status')
      }
    }
  }


  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    await this._checkFieldExists(fields['x-status'], 'x-status')

    
    const customerStatuses = await this._customerStatusesRepository.getStatusesKeys(true)
    const validStatuses = customerStatuses.map(status => status.key)

    console.log("validStatuses", validStatuses)
    console.log("fields['x-status']", fields['x-status'])

    this._checkStatusesProvided(fields['x-status'], validStatuses)

    

    const customers = await this._customerRepository.list(true)
    
    return customers.filter(customer => fields['x-status'].includes(customer.status.key))
  }

}

module.exports = CustomerService
