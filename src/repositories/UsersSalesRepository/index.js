const { Op } = require('sequelize')
const { UsersSales } = require('../../models')



class UsersSalesRepository {
 
  async getUsersSalesBySaleId({ saleId }){
    return await UsersSales.findAll({
      where: {
        saleId: saleId
      },
      include: ["user"],
      
    })
  }

  async create({
    userId,
    saleId,
    raw
  }){
    return await UsersSales.create({
      userId,
      saleId
    }, {
      raw
    })
  }
  
  
}

module.exports = UsersSalesRepository
