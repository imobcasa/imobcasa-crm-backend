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

  async update({
    id,
    userId
  }) {
    return await UsersSales.update({
      userId
    }, {
      where: {
        id: id
      }
    })
  }

  async destroyBySaleId({
    saleId
  }) {
    return await UsersSales.destroy({
      where: {
        saleId: saleId,
      }
    })
  }

 

  async findUsersSalesIdsBySaleId({ saleId }){
    return await UsersSales.findAll({
      where: {
        saleId: saleId
      },
      attributes: ['id'],
      raw: true      
    })
  }

  
  async delete({
    id
  }){
    return await UsersSales.destroy({
      where: {
        saleId: id
      }
    })
  }
  
}

module.exports = UsersSalesRepository
