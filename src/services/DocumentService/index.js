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


/* 
  Se 1 documento estiver como DENIED_DOCUMENTIST mudar para DOC_DENIED_DOCUMENTIST
  se 1 documento estiver como DENIED_BANK mudar para DOC_DENIED_BANK
  se 1 documento estiver como DENIED mudar status para DENIED

  Se todos documentos estiverem como aprovado mudar para DOC_APPROVED
  Se todos estiverem como ANALISIS altera para DOC_ANALISIS


  ____


  QUANDO: O usuário alterar o documento para DENIED_DOCUMENTIST 
  DEVE: alterar o status do usuário para DOC_DENIED_DOCUMENTIST

  QUANDO: O usuário alterar o documento para DENIED_BANK 
  DEVE: alterar o status do usuário para DOC_DENIED_BANK

  QUANDO: O usuário alterar o documento para DENIED 
  DEVE: alterar o status do usuário para DENIED

  QUANDO: O usuário alterar o statusd do documento para APPROVED ou ANALISES
  DEVE: Verificar se existe algum documento com os status: 
    - DENIED_DOCUMENTIST
    - DENIED_BANK
    - DENIED
    SE: Tiver
      DEVE: Manter Status atual
    SENÃO: Verificar se existe algum documento com o status:
      ANALISIS
      SE: Tiver
        DEVE: Alterar o status do usuário para DOC_ANALISIS
      SENÃO: Alterar o status do usuário para DOC_APPROVED
*/


  async _checkCustomerDocumentsExistsByKeys(customerId, keys = []){
    const docStatusesDenied = await this._documentStatusesRepository.getByMultipleKeys({ 
      keys: keys
    })
    const docStatusesDeniedIds = docStatusesDenied.map(statusDoc => statusDoc.id)
    const deniedDocuments = await this._documentsRepository.findAllByMultipleStatuses({ ids:  docStatusesDeniedIds})
    if(deniedDocuments.length === 0){
      return false
    }
    return true
  }

  async _updateCustomerStatusByStatusKey(customerId, statusKey){
    const customerNewStatus = await this._customerStatusesRepository.getStatusByKey(statusKey)
    return await this._customerRepository.updateStatus({ 
      statusId: customerNewStatus.id,
      customerId: customerId
    })
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
        
    const document = await this._documentsRepository.create({
      name,
      url,
      typeId,
      statusId: status.id,
      size,
      customerId
    })

    
    if(await this._checkCustomerRequiredDocuments(customerId)){
      await this._updateCustomerStatusByStatusKey(customerId, "DOC_ANALISIS")
    }else {
      await this._updateCustomerStatusByStatusKey(customerId, "DOC_PENDING")
    }

    return document

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
      if(this._deniedStatusDocsParseToCustomerStatus(status)){
        const newCustomerStatusKey = this._deniedStatusDocsParseToCustomerStatus(status)
        await this._updateCustomerStatusByStatusKey(newCustomerStatusKey)
      }else if( 
        !await this._checkCustomerDocumentsExistsByKeys(document.customerId, [
          "DENIED_DOCUMENTIST",
          "DENIED_BANK",
          "DENIED"
        ])
      ){  
        if(!await this._checkCustomerDocumentsExistsByKeys(document.customerId, ["ANALISIS"])){
          await this._updateCustomerStatusByStatusKey(
            this._deniedStatusDocsParseToCustomerStatus(this._parseToCustomerStatus("ANALISIS"))
          )
        }else {
          await this._updateCustomerStatusByStatusKey(
            this._deniedStatusDocsParseToCustomerStatus(this._parseToCustomerStatus("APPROVED"))
          )
        }
      }
    }

   
        
    return result
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


