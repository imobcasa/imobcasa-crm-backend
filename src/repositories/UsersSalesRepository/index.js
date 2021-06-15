const { Op } = require('sequelize')
const { UsersSales } = require('../../models')



class UsersSalesRepository {
 
  async getUsersSalesBySaleId({ saleId }){
    return await UsersSales.findAll({
      where: {
        saleId: saleId
      },
      include: ["user"]
    })
  }
  
  
}

module.exports = UsersSalesRepository
