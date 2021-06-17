const { DocumentTypes } = require('../../models')



class DocumentTypesRepository {
  async getOne({ id }) {
    return await DocumentTypes.findOne({
      where: {
        id
      }
    })
  }
  

  async listCustomerTypes({
    providedByCustomer
  }){
    return await DocumentTypes.findAll({
      where: {
        providedByCustomer: providedByCustomer
      }
    })
  }

  
}

module.exports = DocumentTypesRepository
