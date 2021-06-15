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
  }){
    return await UsersSales.create({
      userId,
      saleId
    }, {
      include: ['user'],
    })
  }

  async update(
    userSale,
    userId
  ) {
    userSale.userId = userId
    await userSale.save()
    return userSale
  }
  
  
}

module.exports = UsersSalesRepository
