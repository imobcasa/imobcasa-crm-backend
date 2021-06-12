const { Customer } = require('../../models')





class CustomerRepository {

  async list(){
    return await Customer.findAll({
      include: ['user']
    })
  }

}

module.exports = CustomerRepository