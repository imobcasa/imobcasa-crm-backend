const { Customers } = require('../../models')





class CustomerRepository {

  async list(raw = false){
    return await Customers.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "fullName", "username", "managerId"]
        }, {
          association: "status",
          attributes: ["id", "name", "key"]
        }],
      raw,
      attributes: ["id", "fullName", "phone"]
    })
  }

  async create({
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
    statusId
  }){
    return await Customers.create({
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
      include: [
        {
          association: "user",
          attributes: ["id", "fullName", "username", "managerId"]
        }, {
          association: "status",
          attributes: ["id", "name", "key"]
        }
      ]
    })
  }

  async update(customer, fields){
    customer.fullName = fields.fullName
    customer.cpf = fields.cpf
    customer.email = fields.email
    customer.phone = fields.phone
    customer.birthDate = fields.birthDate
    customer.incomes = fields.incomes
    customer.fgts = fields.fgts
    customer.startDate = fields.startDate
    customer.origin = fields.origin
    customer.productInterest = fields.productInterest
    customer.regionInterest = fields.regionInterest
    customer.biddersQuantity = fields.biddersQuantity
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

  async updateStatus({
    statusId,
    customerId
  }) {
    return await Customers.update({
      statusId
    }, {
      where: {
        id: customerId
      }
    })
  }

}

module.exports = CustomerRepository