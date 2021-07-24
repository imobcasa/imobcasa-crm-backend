const { Op } = require('sequelize')
const { CustomerStatuses } = require('../../models')



const docEnuns = {
  DOCUMENTISTA: ['DOC_ANALISIS', 'DOC_DENIED_DOCUMENTIST', 'DOC_DENIED_BANK', 'DOC_APPROVED', 'DENIED'],
  FINANCEIRO: ['SALE_GENERATED'],
  GESTOR: ['DOC_PENDING', 'DOC_ANALISIS', 'DOC_DENIED_DOCUMENTIST', 'DOC_DENIED_BANK', 'DOC_APPROVED', 'DENIED', 'SALE_GENERATED', 'DONE'],
  CORRETOR: ['DOC_PENDING', 'DOC_ANALISIS', 'DOC_DENIED_DOCUMENTIST', 'DOC_DENIED_BANK', 'DOC_APPROVED', 'DENIED', 'SALE_GENERATED', 'DONE'],
  ADMINISTRADOR: ['DOC_PENDING', 'DOC_ANALISIS', 'DOC_DENIED_DOCUMENTIST', 'DOC_DENIED_BANK', 'DOC_APPROVED', 'DENIED', 'SALE_GENERATED', 'DONE'],
}


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

  async listAll({ profileName }){
    return await CustomerStatuses.findAll({
      where: {
        key: {
          [Op.in]: docEnuns[profileName]
        }
      }
    })
  }

  
  
}

module.exports = CustomerStatusesRepository
