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

  async getStatusByKey(key = "", raw = false){
    return await CustomerStatuses.findOne({
      attributes: {
        exclude: ['order', 'createdAt', 'key', 'updatedAt', 'name' ]
      },
      raw,
      where: {
        key
      }
    })
  }

  async listAll(){
    return await CustomerStatuses.findAll()
  }
  
  
}

module.exports = CustomerStatusesRepository
