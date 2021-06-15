const { Op } = require('sequelize')
const { Sales } = require('../../models')



class SalesRepository {
 
  async getSaleByCustomerId({ customerId }){
    return await Sales.findOne({
      where: {
        customerId: customerId
      },
      include: ["customer"]
    })
  }
  
  
}

module.exports = SalesRepository
