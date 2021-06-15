const { Op } = require('sequelize')
const { UsersSales } = require('../../models')



class UsersSalesRepository {
 
  async getUsersSalesBySaleId({ saleId }){
    return await UsersSales.findOne({
      where: {
        saleId: saleId
      },
      include: ["sale", "user"]
    })
  }
  
  
}

module.exports = UsersSalesRepository
