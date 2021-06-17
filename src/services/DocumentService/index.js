const Service = require('../Service')
const { 
  DocumentTypesRepository, 
  DocumentStatusesRepository, 
  DocumentsRepository,
  CustomerRepository
} = require('../../repositories')

class DocumentService extends Service {

  _createRequiredFields = [
    "originalname",
    "path",
    "typeId",
    "size",
    "customerId"
  ]

  _getByCustomerRequiredFields = [
    "x-customer-id"
  ]

  _changeStatusRequiredFies = [
    "id",
    "statusId"
  ]

  _changeTypeRequriedFields = [
    "id",
    "typeId"
  ]

  _changeFileRequiredFields = [
    "originalname",
    "path",
    "size",
    "x-file-id"
  ]

  _listTypesRequiredFiels = [
    "providedByCustomer"
  ]

  constructor(){
    super()
    this._documentTypesRepository = new DocumentTypesRepository()
    this._documentStatusesRepository = new DocumentStatusesRepository()
    this._documentsRepository = new DocumentsRepository()
    this._customerRepository = new CustomerRepository()
  }


  async create(fields){ 
    this._checkRequiredFields(this._createRequiredFields, fields)
    
    const  {
      originalname : name,
      path : url,
      typeId,
      size,
      customerId
    } = fields

    this._checkEntityExsits(
      await this._customerRepository.getOne({ id: customerId }),
      "customerId"
    )

    this._checkEntityExsits(
      await this._documentTypesRepository.getOne({ id: typeId }),
      "typeId"
    )

    const status = await this._documentStatusesRepository.getFirstStatus()
    
    return await this._documentsRepository.create({
      name,
      url,
      typeId,
      statusId: status.id,
      size,
      customerId
    })

  }


  async listByCustomer(fields){
    this._checkRequiredFields(this._getByCustomerRequiredFields, fields)

    this._checkEntityExsits(
      await this._customerRepository.getOne({ id: fields['x-customer-id']}),
      'x-customer-id'
    )
        
    return await this._documentsRepository.listByCustomerId({
      customerId: fields['x-customer-id']
    })
  }

  async changeStatus(fields){
    this._checkRequiredFields(this._changeStatusRequiredFies, fields)

    this._checkEntityExsits(
      await this._documentsRepository.getOne({ id: fields.id }), 
      "id"
    )

    this._checkEntityExsits(
      await this._documentStatusesRepository.getOne({ id: fields.statusId }),
      "statusId"
    )

    
    return await this._documentsRepository.changeStatus({
      id: fields.id,
      statusId: fields.statusId
    })
  }

  async changeFile(fields){
    await this._checkRequiredFields(this._changeFileRequiredFields, fields)
    this._checkEntityExsits(
      await this._documentsRepository.getOne({ id: fields['x-file-id'] }),
      'x-file-id'
    )

    const {
      originalname: name,
      path: url,
      size,      
    } = fields

    return await this._documentsRepository.updateFile({
      name,
      url,
      size,
      id: fields['x-file-id']
    })
  }

  async changeType(fields){
    this._checkRequiredFields(this._changeTypeRequriedFields, fields)


    this._checkEntityExsits(
      await this._documentsRepository.getOne({ id: fields.id }), 
      "id"
    )

    this._checkEntityExsits(
      await this._documentTypesRepository.getOne({ id: fields.typeId }),
      "typeId"
    )


    return await this._documentsRepository.changeType({
      id: fields.id,
      typeId: fields.typeId
    })
  }

  async listDocumentStatus(){
    return await this._documentStatusesRepository.list()
  }

  async listDocumentTypesCustomer(fields){
    this._checkRequiredFields(this._listTypesRequiredFiels, fields)
    return await this._documentTypesRepository.listCustomerTypes({
      providedByCustomer: fields.providedByCustomer === 1 ? true : false
    })
  }


}

module.exports = DocumentService

