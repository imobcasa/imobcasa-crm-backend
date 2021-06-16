const Service = require('../Service')
const { DocumentTypesRepository, DocumentStatusesRepository, DocumentsRepository } = require('../../repositories')

class DocumentService extends Service {

  constructor(){
    super()
    this._documentTypesRepository = new DocumentTypesRepository()
    this._documentStatusesRepository = new DocumentStatusesRepository()
    this._documentsRepository = new DocumentsRepository()
  }


  async create(){ 
    
    
    return {}

  }




}

module.exports = DocumentService
