const { Op } = require('sequelize')
const { Sales } = require('../../models')



class SalesRepository {
 
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

  async update(sale, {
    customerId,
    projectName,
    unityName,
    tower,
    value,
    observations
  }) {
    sale.customerId =  customerId
    sale.projectName =  projectName
    sale.unityName =  unityName
    sale.tower =  tower
    sale.value =  value
    sale.observations =  observations

    await sale.save()
    return sale
  }
  
}

module.exports = SalesRepository
