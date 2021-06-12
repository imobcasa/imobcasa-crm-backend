const { Customer } = require('../../models')





class CustomerRepository {

  async list(raw = false){
    return await Customer.findAll({
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
    return await Customer.create({
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
    return await Customer.findOne({
      where: {
        id: fields.id
      },
      raw,
      include: ['status', 'user']
    })
  }

}

module.exports = CustomerRepository