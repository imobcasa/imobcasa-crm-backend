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

  async getApprovedStatus(){
    return await DocumentStatuses.findOne({
      where: {
        key: 'APPROVED'
      }

    })
  }



  async list(){
    return await DocumentStatuses.findAll()
  }

  async getByMultipleKeys({ keys = [] }) {
    return await DocumentStatuses.findAll({
      where: {
        key: keys
      }
    })
  }  
}

module.exports = DocumentStatusesRepository
