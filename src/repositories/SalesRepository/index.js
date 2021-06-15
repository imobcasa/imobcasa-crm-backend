const { Op } = require('sequelize')
const { Sales } = require('../../models')



class SalesRepository {
 
  async getSaleByCustomerId({ customerId }){
    return await Sales.findOne({
      where: {
        customerId: customerId
      }
    })
  }
  

  async create({
    customerId,
    projectName,
    unityName,
    tower,
    value,
    observations,
    raw
  }){
    return await Sales.create({
      customerId,
      projectName,
      unityName,
      tower,
      value,
      observations
    }, {
      raw
    })
  }
  
}

module.exports = SalesRepository
