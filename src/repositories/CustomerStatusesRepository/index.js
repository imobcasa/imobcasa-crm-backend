const { Op } = require('sequelize')
const { CustomerStatuses } = require('../../models')



class CustomerStatusesRepository {

 
  async getStatusesKeys(raw = false){
    return await CustomerStatuses.findAll({
      attributes: {
        exclude: ['order', 'createdAt', 'id', 'updatedAt', 'name' ]
      },
      raw
    })
  }
  
  
}

module.exports = CustomerStatusesRepository
