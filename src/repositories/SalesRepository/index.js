const { Op } = require('sequelize')
const { Sales } = require('../../models')



class SalesRepository {
 
  async getOne({ id }){
    return await Sales.findOne({
      where: {
        id
      },
    })
  }

  async getSaleByCustomerId({ customerId }){
    return await Sales.findOne({
      where: {
        customerId: customerId
      },
    })
  }
  

  async create({
    customerId,
    projectName,
    unityName,
    tower,
    value,
    observations
  }){
    return await Sales.create({
      customerId,
      projectName,
      unityName,
      tower,
      value,
      observations
    })
  }

  async update({
    id,
    projectName,
    unityName,
    tower,
    value,
    observations
  }) {
    return Sales.update({
      projectName,
      unityName,
      tower,
      value,
      observations
    }, {
      where: {
        id: id
      }
    })
  }

  async delete({
    id
  }){
    return await Sales.destroy({
      where: {
        id
      }
    })
  }
  
  
}

module.exports = SalesRepository
