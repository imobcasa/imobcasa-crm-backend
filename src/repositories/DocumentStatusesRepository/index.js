const { DocumentStatuses } = require('../../models')



class DocumentStatusesRepository {
 
  async getOne({ id }) {
    return await DocumentStatuses.findOne({
      where: {
        id
      }
    })
  }

  async getFirstStatus(){
    return await DocumentStatuses.findOne({
      where: {
        order: 1
      }

    })
  }


  async list(){
    return await DocumentStatuses.findAll()
  }
  
  
}

module.exports = DocumentStatusesRepository
