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
  __getOneRequiuredFields = ['x-customer-id', 'reqUserId', 'admin']
  _updateRequiredFields = [
    "x-customer-id",
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
    "userId",
    "reqUserId",
    "admin",
  ]

  constructor() {
    super()
    this._customerRepository = new CustomerRepository()
    this._customerStatusesRepository = new CustomerStatusesRepository()
    this._userRepository = new UserRepository()
  }


  _checkStatusesProvided(statuses = [], validStatuses = []) {

    for (const status of statuses) {
      if (!validStatuses.includes(status)) {
        this._throwInvalidParamError('x-status')
      }
    }
  }

  _checkUserAccessToCustomer(userId, customerUserId, admin){
    if(!admin){
      if(userId !== customerUserId){
        this._throwForbidenError()
      }
    }
    
  }


  async list(fields) {
    await this._checkRequiredFields(this._listRequiredFields, fields)
    await this._checkFieldExists(fields['x-status'], 'x-status')


    const customerStatuses = await this._customerStatusesRepository.getStatusesKeys(true)
    const validStatuses = customerStatuses.map(status => status.key)

    const statusesProvided = fields['x-status'].split(',')
    this._checkStatusesProvided(statusesProvided, validStatuses)

    const customers = await this._customerRepository.list()

    return customers.filter(customer => statusesProvided.includes(customer.status.key))
  }

  async create(fields) {
    this._checkRequiredFields(this._createRequiredFields, fields)

    const user = await this._userRepository.getOne({
      id: fields.userId
    }, ['password'], true)

    this._checkEntityExsits(user, 'userId')

    const status = await this._customerStatusesRepository.getStatusByKey("DOC_PENDING")
    
    const {
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuatity,
      userId,   
    } = fields

    return await this._customerRepository.create({
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuatity,
      userId,   
      statusId: status.id
    })
  }

  async getOne(fields){
    this._checkRequiredFields(this.__getOneRequiuredFields, fields)
    this._checkFieldExists(fields['x-customer-id'], 'x-customer-id')

    const customer = await this._customerRepository.getOne({ id: fields['x-customer-id']})
    this._checkEntityExsits(customer, 'x-customer-id')

    this._checkUserAccessToCustomer(fields.reqUserId, customer.userId, fields.admin)

    delete customer.user.password

    return customer
  }

  async update(fields){
    this._checkRequiredFields(this._updateRequiredFields, fields)
    this._checkFieldExists(fields['x-customer-id'], 'x-customer-id')

    const customer = await this._customerRepository.getOne({
      id: fields['x-customer-id']
    })
    this._checkEntityExsits(customer, 'x-customer-id')

    this._checkUserAccessToCustomer(fields.reqUserId, customer.userId, fields.admin)


    const { 
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuatity,
      userId
    } = fields

    return await this._customerRepository.update(customer, { 
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuatity,
      userId
    } )
  }

}

module.exports = CustomerService

