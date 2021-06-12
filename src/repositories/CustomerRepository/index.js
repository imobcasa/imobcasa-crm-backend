const { Customer } = require('../../models')





class CustomerRepository {

  async list(){
    return await Customer.findAll({
      include: ['user', 'status']
    })
  }

}

module.exports = CustomerRepository