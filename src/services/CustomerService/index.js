const Service = require('../Service')
const { CustomerRepository, CustomerStatusesRepository, UserRepository } = require('../../repositories')


class CustomerService extends Service {

  _listRequiredFields = ['x-status', 'reqUserId', 'admin']
  _createRequiredFields = [
    "fullName",
    "cpf",
    "email",
    "phone",
    "birthDate",
    "incomes",
    "startDate",
    "origin",
    "productInterest",
    "regionInterest",
    "biddersQuatity",
    "userId"
  ]

  constructor(){
    super()
    this._customerRepository = new CustomerRepository()
    this._customerStatusesRepository = new CustomerStatusesRepository()
    this._userRepository = new UserRepository()
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

    const statusesProvided = fields['x-status'].split(',')
    this._checkStatusesProvided(statusesProvided, validStatuses)

    const customers = await this._customerRepository.list(true)
    
    return customers.filter(customer => statusesProvided.includes(customer.status.key))
  }

  async create(fields){
    this._checkRequiredFields(this._createRequiredFields, fields)
    
    const user = await this._userRepository.getOne({
      id: fields.userId
    }, ['password'], true)

    this._checkEntityExsits(user, 'userId')

    return {}
  }

}

module.exports = CustomerService
