const Service = require('../Service')
const { 
  DocumentTypesRepository, 
  DocumentStatusesRepository, 
  DocumentsRepository,
  CustomerRepository,
  CustomerStatusesRepository
} = require('../../repositories')

class DocumentService extends Service {

  _createRequiredFields = [
    "originalname",
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
    "size",
    "x-file-id"
  ]

  _listTypesRequiredFiels = [
    "provided-customer"
  ]

  _deleteRequiredFields = [
    "x-document-id"
  ]

  constructor(){
    super()
    this._documentTypesRepository = new DocumentTypesRepository()
    this._documentStatusesRepository = new DocumentStatusesRepository()
    this._documentsRepository = new DocumentsRepository()
    this._customerRepository = new CustomerRepository()
    this._customerStatusesRepository = new CustomerStatusesRepository()
  }


  async _checkCustomerRequiredDocuments(customerId){
    const documentTypes = await this._documentTypesRepository.listCustomerTypes({ providedByCustomer: true })
    
    for(const docType of documentTypes){
      const document = await this._documentsRepository.findByCustomerAndTypeId({
        customerId,
        typeId: docType.id
      })
      if(!document){
        return false
      }
    }

    return true
  }


  async _checkCustomerDocumentsExistsByKeys(customerId, keys = []){
    const docStatuses = await this._documentStatusesRepository.getByMultipleKeys({ 
      keys: keys
    })
    const docStatusesIds = docStatuses.map(statusDoc => statusDoc.id)
    const documentsFinded = await this._documentsRepository.findAllByMultipleStatuses({ ids:  docStatusesIds, customerId})
    if(documentsFinded.length === 0){
      return false
    }
    return true
  }

  async _updateCustomerStatusByStatusKey(customerId, statusKey){
    const customerNewStatus = await this._customerStatusesRepository.getStatusByKey(statusKey)
    if(customerNewStatus){
      return await this._customerRepository.updateStatus({ 
        statusId: customerNewStatus.id,
        customerId: customerId
      })
    }
    
  }

  _docStatusLevel({ key }){
    return {
      ANALISIS: false,
      DENIED_DOCUMENTIST: true,
      DENIED_BANK: true,
      APPROVED: false,
      DENIED: true,
    }[key] || ""
  }


  _parseToCustomerStatus({ key }){
    return {
      ANALISIS: "DOC_ANALISIS",
      DENIED_DOCUMENTIST: "DOC_DENIED_DOCUMENTIST",
      DENIED_BANK: "DOC_DENIED_BANK",
      APPROVED: "DOC_APPROVED",
      DENIED: "DOC_DENIED",
    }[key] || ""
  }

  _deniedStatusDocsParseToCustomerStatus({ key }){
    return {
      DENIED_DOCUMENTIST: "DOC_DENIED_DOCUMENTIST",
      DENIED_BANK: "DOC_DENIED_BANK",
      DENIED: "DOC_DENIED",
    }[key] || false
  }

  
  async _checkCustomerDocumentsStatuses(statusKey, customerId){
    if(this._deniedStatusDocsParseToCustomerStatus({ key: statusKey})){
      const newCustomerStatusKey = this._deniedStatusDocsParseToCustomerStatus({ key: statusKey})
      await this._updateCustomerStatusByStatusKey(customerId, newCustomerStatusKey)
    }else if(!await this._checkCustomerDocumentsExistsByKeys(customerId, 
      [
        "DENIED_DOCUMENTIST",
        "DENIED_BANK",
        "DENIED"
      ])
    ){  
      if(await this._checkCustomerDocumentsExistsByKeys(customerId, ["ANALISIS"])){
        const newCustomerStatusKey = this._parseToCustomerStatus({ key: "ANALISIS" })
        await this._updateCustomerStatusByStatusKey(customerId, newCustomerStatusKey)
      }else {
        const newCustomerStatusKey = this._parseToCustomerStatus({ key: "APPROVED" })
        await this._updateCustomerStatusByStatusKey(customerId, newCustomerStatusKey)
      }
    }
  }


  async create(fields){ 
    this._checkRequiredFields(this._createRequiredFields, fields)
    
    const  {
      originalname : name,
      size,
      customerId
    } = fields    

    const storage = process.env.NODE_ENV === "test" ? "local" : process.env.STORAGE_TYPE
    const url = storage === "s3" ? fields.location : fields.path

    this._checkEntityExsits(
      await this._customerRepository.getOne({ id: customerId }),
      "customerId"
    )

    const status = await this._documentStatusesRepository.getFirstStatus()
        
    return await this._documentsRepository.create({
      name,
      url,
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

    const document = await this._documentsRepository.getOne({ id: fields.id })    
    this._checkEntityExsits(
      document, 
      "id"
    )

    const status = await this._documentStatusesRepository.getOne({ id: fields.statusId })

    this._checkEntityExsits(
      status,
      "statusId"
    )
    
    const result = await this._documentsRepository.changeStatus({
      id: fields.id,
      statusId: fields.statusId
    })

    //UPDATE IF CUSTOMER HAS ALL NECESSARY DOCUMENTATIONS
    if(await this._checkCustomerRequiredDocuments(document.customerId)){
      await this._checkCustomerDocumentsStatuses(status.key, document.customerId)
    }
  
        
    return result
  }

  async changeFile(fields){
    await this._checkRequiredFields(this._changeFileRequiredFields, fields)
    
    const document = await this._documentsRepository.getOne({ id: fields['x-file-id'] })

    this._checkEntityExsits(
      document,
      'x-file-id'
    )

    const {
      originalname: name,
      size,      
    } = fields

    const storage = process.env.NODE_ENV === "test" ? "local" : process.env.STORAGE_TYPE
    const url = storage === "s3" ? fields.location : fields.path


    const result = await this._documentsRepository.updateFile({
      name,
      url,
      size,
      id: fields['x-file-id']
    })

    const status = await this._documentStatusesRepository.getFirstStatus()
    await this._documentsRepository.changeStatus({
      id: fields['x-file-id'],
      statusId: status.id
    })


    if(await this._checkCustomerRequiredDocuments(document.customerId)){
      await this._checkCustomerDocumentsStatuses(status.key, document.customerId)
    }else {
      await this._updateCustomerStatusByStatusKey(document.customerId, "DOC_PENDING")
    }

    return result
  }

  async changeType(fields){
    this._checkRequiredFields(this._changeTypeRequriedFields, fields)


    const document = await this._documentsRepository.getOne({ id: fields.id })

    this._checkEntityExsits(document, "id")

    this._checkEntityExsits(
      await this._documentTypesRepository.getOne({ id: fields.typeId }),
      "typeId"
    )

    const result = await this._documentsRepository.changeType({
      id: fields.id,
      typeId: fields.typeId
    })


    const status = await this._documentStatusesRepository.getFirstStatus()
    await this._documentsRepository.changeStatus({
      id: fields.id,
      statusId: status.id
    })


    if(await this._checkCustomerRequiredDocuments(document.customerId)){
      await this._checkCustomerDocumentsStatuses(status.key, document.customerId)
    }else {
      await this._updateCustomerStatusByStatusKey(document.customerId, "DOC_PENDING")
    }

    return result
  }

  async listDocumentStatus(){
    return await this._documentStatusesRepository.list()
  }

  async listDocumentTypesCustomer(fields){
    this._checkRequiredFields(this._listTypesRequiredFiels, fields)
    const providedByCustomer = parseInt(fields['provided-customer'])
    return await this._documentTypesRepository.listCustomerTypes({
      providedByCustomer: providedByCustomer === 1 ? true : false
    })
  }

  async deleteDocument(fields){
    this._checkRequiredFields(this._deleteRequiredFields, fields)
    
    const document = await this._documentsRepository.getOne({ id: fields['x-document-id'] })
    
    this._checkEntityExsits(
      document,
      'x-document-id'
    )

    const resultDelete = await this._documentsRepository.delete({ id: fields['x-document-id'] })

    if(!await this._checkCustomerRequiredDocuments(document.customerId)){
      const customerStatus = await this._customerStatusesRepository.getStatusByKey("DOC_PENDING")
      await this._customerRepository.updateStatus({
        customerId: document.customerId,
        statusId: customerStatus.id
      })
    }


    return resultDelete
  }

}

module.exports = DocumentService


