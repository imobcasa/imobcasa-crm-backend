const { Customers } = require('../../models')





class CustomerRepository {

  async list(raw = false){
    return await Customers.findAll({
      include: ['user', 'status'],
      raw
    })
  }

  async create({
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
    statusId
  }){
    return await Customers.create({
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
      statusId
    }, {
      raw: true,
      include: ['status']
    })
  }

  async getOne(fields, raw = false){
    return await Customers.findOne({
      where: {
        id: fields.id
      },
      raw,
      include: ['status', 'user']
    })
  }

  async update(customer, fields){
    customer.fullName = fields.fullName
    customer.cpf = fields.cpf
    customer.email = fields.email
    customer.phone = fields.phone
    customer.birthDate = fields.birthDate
    customer.incomes = fields.incomes
    customer.startDate = fields.startDate
    customer.origin = fields.origin
    customer.productInterest = fields.productInterest
    customer.regionInterest = fields.regionInterest
    customer.biddersQuatity = fields.biddersQuatity
    customer.userId = fields.userId

    return await customer.save()
  }

  async getByPhone(phone, raw){
    return await Customers.findOne({
      where: {
        phone,
        
      },
      raw,
      include: ['user', 'status']
    })
  }

}

module.exports = CustomerRepository