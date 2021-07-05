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
    "biddersQuantity",
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
    "biddersQuantity",
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

  _checkUserAccessToCustomer(userId, customer, admin, teamManager){
    if(!admin){
      if(teamManager){
        if(userId !== customer.user.managerId){
          this._throwForbidenError()
        }
        return true
      }
      if(userId !== customer.user.id){
        this._throwForbidenError()
      }
    }    
  }

  async _filterUserAccessToCustomer(customers = [], admin, userId, teamManager ){
    const filteredUsers = customers.filter(customer => {
      if(admin){
        return customer
      }     

      if(teamManager){
        return customer.user.managerId === userId ? customer : null
      }

      return customer.user.id === userId ? customer : null
    })

    return filteredUsers
  }


  async list(fields) {
    await this._checkRequiredFields(this._listRequiredFields, fields)
    await this._checkFieldExists(fields['x-status'], 'x-status')


    const customerStatuses = await this._customerStatusesRepository.getStatusesKeys(true)
    const validStatuses = customerStatuses.map(status => status.key)

    const statusesProvided = fields['x-status'].split(',')
    this._checkStatusesProvided(statusesProvided, validStatuses)

    const customers = await this._customerRepository.list(false, fields['x-query'])
    

    return this._filterUserAccessToCustomer(
        customers.filter(customer => statusesProvided.includes(customer.status.key)
      ), 
      fields.profile.admin || fields.profile.name.toUpperCase() === "FINANCEIRO" || fields.profile.name.toUpperCase() === "DOCUMENTISTA", 
      fields.reqUserId, 
      fields.profile.teamManager
    )
  }

  async create(fields) {
    this._checkRequiredFields(this._createRequiredFields, fields)

    const user = await this._userRepository.getOne({
      id: fields.userId
    }, ['password'], true)

    this._checkEntityExsits(user, 'userId')

    const customer = await this._customerRepository.getByPhone(fields.phone, true)
    this._checkEntityExsits(customer, "phone", true)
    
    const status = await this._customerStatusesRepository.getStatusByKey("DOC_PENDING")   
    const {
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      fgts,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuantity,
      userId,   
    } = fields

    return await this._customerRepository.create({
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      fgts,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuantity,
      userId,   
      statusId: status.id
    })
  }

  async getOne(fields){
    this._checkRequiredFields(this.__getOneRequiuredFields, fields)
    this._checkFieldExists(fields['x-customer-id'], 'x-customer-id')

    const customer = await this._customerRepository.getOne({ id: fields['x-customer-id']})
    this._checkEntityExsits(customer, 'x-customer-id')

    this._checkUserAccessToCustomer(
      fields.reqUserId, 
      customer, 
      fields.admin || fields.profile.name.toUpperCase() === "FINANCEIRO" || fields.profile.name.toUpperCase() === "DOCUMENTISTA", 
      fields.profile.teamManager)

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

    this._checkUserAccessToCustomer(fields.reqUserId, customer, fields.admin, fields.profile.teamManager)

    const customerSamePhone = await this._customerRepository.getByPhone(fields.phone, true)
    if(customer.id !== customerSamePhone?.id){
      this._checkEntityExsits(customerSamePhone, "phone", true)
    }


    const { 
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      fgts,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuantity,
      userId
    } = fields

    return await this._customerRepository.update(customer, { 
      fullName,
      cpf,
      email,
      phone,
      birthDate,
      incomes,
      fgts,
      startDate,
      origin,
      productInterest,
      regionInterest,
      biddersQuantity,
      userId
    } )
  }

}

module.exports = CustomerService

