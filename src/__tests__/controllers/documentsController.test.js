const { DocumentsController } = require('../../controllers')
const { missingParamError, invalidParamError, forbidenError, conflictError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const documentsController = new DocumentsController


const Setup = require('../helpers/Setups')
const setupTests = new Setup()


describe("DOCUMENTS CONTROLLER Tests", () => {
  let user
  let profile

  let customerStatus
  let customerStatus2
  let customer

  let documentStatus
  let documentStatus2
  let documentType
  let documentType2
  let document
  beforeAll(async () => {
    try {
      await setupTests.databaseSetup()
      await setupTests.destroyDocuments()
      await setupTests.destroyDocumentTypes()
      await setupTests.destroyDocumentStatuses()
      await setupTests.destroyCustomers()
      await setupTests.destroyCustomerStatuses()
      await setupTests.destroyUsers()
      await setupTests.destroyProfiles()


      profile = await setupTests.generateProfile("Administrador", true, false)
      user = await setupTests.generateUser("mockedUser", profile.id)

      customerStatus = await setupTests.generateCustomerStatus("Pendente de Documentação", 1, "DOC_PENDING")
      customerStatus2 = await setupTests.generateCustomerStatus("Documentação em análise", 2, "DOC_ANALISIS")
      customer = await setupTests.generateCustomer(user.id, customerStatus.id)

      documentStatus = await setupTests.generateDocumentStatus("Em análise", 1, "ANALISIS")
      documentStatus2 = await setupTests.generateDocumentStatus("Negado pelo documentista", 2, "DENIED_DOCUMENTIST")
      documentType = await setupTests.generateDocumentType("Ficha", true, "FORM_DOC")
      documentType2 = await setupTests.generateDocumentType("Comprovante comissão corretor", false, "BROKER_COMMISSION_VOUCHER_DOC")
      document = await setupTests.generateDocument(
        "0b3e12e1d7f71a26539c4902ac9332c9-wp4676582.jpg",
        "http://site.com.br/0b3e12e1d7f71a26539c4902ac9332c9-wp4676582.jpg",
        documentType.id,
        documentStatus.id,
        459621,
        customer.id
      )

    } catch (err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await setupTests.destroyDocuments()
      await setupTests.destroyDocumentTypes()
      await setupTests.destroyDocumentStatuses()
      await setupTests.destroyCustomers()
      await setupTests.destroyCustomerStatuses()
      await setupTests.destroyUsers()
      await setupTests.destroyProfiles()
    } catch (err) {
      console.log(err.toString())
    }
  })

  describe("1 - CREATE tests", () => {

    const requiredFields = [
      "typeId",
      "customerId"
    ]
    let testPos = 1
    for(const field of requiredFields){
      it(`1.1.${testPos} Should return 400 if no ${field} has been provided`, async () => {
        const body = {
          customerId: customer.id,
          typeId: documentType.id
        }
        const file = {
          originalname: 'wp4676582.jpg',
          size: 459621 ,
          path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
        }
       
        delete body[`${field}`]

        const req = mocks.mockReq(body, null, null, null, null, file)
        const res = mocks.mockRes()
        await documentsController.create(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
      testPos += 1
    }

    it(`1.2 Should return 400 if no originalname has been provided`, async () => {
      const body = {
        customerId: customer.id,
        typeId: documentType.id
      }
      const file = {
        size: 459621 ,
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
      }
     
      const req = mocks.mockReq(body, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.create(req, res)
      const { error } = missingParamError("originalname")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it(`1.3 Should return 400 if no size has been provided`, async () => {
      const body = {
        customerId: customer.id,
        typeId: documentType.id
      }
      const file = {
        originalname: 'wp4676582.jpg',
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
      }
     
      const req = mocks.mockReq(body, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.create(req, res)
      const { error } = missingParamError("size")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`1.4 Should return 400 if no path has been provided`, async () => {
      const body = {
        customerId: customer.id,
        typeId: documentType.id
      }
      const file = {
        originalname: 'wp4676582.jpg',
        size: 459621 ,
      }
     
      const req = mocks.mockReq(body, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.create(req, res)
      const { error } = missingParamError("path")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it(`1.5 Should return 400 if invalid customerId has been provided`, async () => {
      const body = {
        customerId: "INVALID ID",
        typeId: documentType.id
      }
      const file = {
        originalname: 'wp4676582.jpg',
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg',
        size: 459621 ,
      }
     
      const req = mocks.mockReq(body, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.create(req, res)
      const { error } = invalidParamError("customerId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it(`1.6 Should return 400 if invalid typeId has been provided`, async () => {
      const body = {
        customerId: customer.id,
        typeId: "IVNALIDID"
      }
      const file = {
        originalname: 'wp4676582.jpg',
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg',
        size: 459621 ,
      }
     
      const req = mocks.mockReq(body, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.create(req, res)
      const { error } = invalidParamError("typeId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })


    it(`1.7 Should return 200 if document was created`, async () => {
      const body = {
        customerId: customer.id,
        typeId: documentType.id
      }
      const file = {
        originalname: 'wp4676582.jpg',
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg',
        size: 459621 ,
      }
     
      const req = mocks.mockReq(body, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.documentsModel()
      }))
    })
    

  })


  describe("2 - LIST tests", () => {
    it("2.1 - Should return 400 if no x-customer-id has been provided", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()

      await documentsController.listByCustomer(req, res)

      const { error } = missingParamError("x-customer-id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("2.2 - Should return 400 if ivnalid x-customer-id has been provided", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'x-customer-id': "INVALID CUSTOMER ID"
      })
      const res = mocks.mockRes()
      await documentsController.listByCustomer(req, res)
      const { error } = invalidParamError("x-customer-id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("2.3 - Should return 200", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()
      await documentsController.listByCustomer(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        ...modelsExpected.documentsModel()
      })]))
    })    
  })

  describe("3 - CHANGE STATUS tests", () => {
    it("3.1 - Should return 400 if no id has been provided", async () => {
      const body = {
        statusId: documentStatus.id,
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeStatus(req, res)

      const { error } = missingParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.2 - Should return 400 if no statusId has been provided", async () => {
      const body = {
        id: document.id,
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeStatus(req, res)

      const { error } = missingParamError("statusId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.3 - Should return 400 if invalid id has been provided", async () => {
      const body = {
        id: "Invalid ID",
        statusId: documentStatus.id
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeStatus(req, res)

      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.4 - Should return 400 if invalid statusId has been provided", async () => {
      const body = {
        id: document.id,
        statusId: "INVALID STATUS ID"
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeStatus(req, res)

      const { error } = invalidParamError("statusId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.5 - Should return 200 if document status was updated", async () => {
      const body = {
        id: document.id,
        statusId: documentStatus2.id
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeStatus(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([1])
    })
  })

  describe("4 - CHANGE FILE tests", () => {
    it(`4.1 Should return 400 if no x-file-id has been provided`, async () => {
      const file = {
        originalname: 'wp4676582.jpg',
        size: 459621 ,
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
      }
     
      const req = mocks.mockReq(null, null, null, null, null, file)
      const res = mocks.mockRes()
      await documentsController.changeFile(req, res)
      const { error } = missingParamError("x-file-id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`4.2 Should return 400 if no originalname has been provided`, async () => {
      const file = {
        size: 459621 ,
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
      }
     
      const req = mocks.mockReq(null, null, null, null, {
        'x-file-id': document.id
      }, file)
      const res = mocks.mockRes()
      await documentsController.changeFile(req, res)
      const { error } = missingParamError("originalname")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it(`4.3 Should return 400 if no size has been provided`, async () => {
      const file = {
        originalname: 'wp4676582.jpg',
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
      }
     
      const req = mocks.mockReq(null, null, null, null, {
        'x-file-id': document.id
      }, file)
      const res = mocks.mockRes()
      await documentsController.changeFile(req, res)
      const { error } = missingParamError("size")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`4.4 Should return 400 if no path has been provided`, async () => {
      const file = {
        originalname: 'wp4676582.jpg',
        size: 459621 ,
      }
     
      const req = mocks.mockReq(null, null, null, null, {
        'x-file-id': document.id
      }, file)
      const res = mocks.mockRes()
      await documentsController.changeFile(req, res)
      const { error } = missingParamError("path")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it(`4.4 Should return 400 if invalid x-file-id has been provided`, async () => {
      const file = {
        originalname: 'wp4676582.jpg',
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg',
        size: 459621 ,
      }
     
      const req = mocks.mockReq(null, null, null, null, {
        'x-file-id': "INVALID FILE ID"
      }, file)
      const res = mocks.mockRes()
      await documentsController.changeFile(req, res)
      const { error } = invalidParamError("x-file-id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it(`4.5 Should return 200 file was updated`, async () => {
      const file = {
        originalname: 'wp4676582.jpg',
        size: 459621,
        path: 'C:\\Users\\Heron Eto\\Documents\\GitHub\\imobcasa-crm-backend\\tmp\\uploads\\d0eee3427fd69c5d9b89cda4bc573d8a-wp4676582.jpg'
      }

      const req = mocks.mockReq(null, null, null, null, {
        'x-file-id': document.id
      }, file)
      const res = mocks.mockRes()
      await documentsController.changeFile(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([1])
    })
  })

  describe("5 - LIST DOCUMENTS STATUS tests", () => {
    it("5.1 - Should reutrn 200", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await documentsController.listDocumentStatuses(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          ...modelsExpected.documentsStatusesModel()
        })
      ]))      
    })
  })

  describe("6 - LIST DOCUMENTS TYPES tests", () => {

    it("6.1 - Should return 400 if no provided-customer was provided", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await documentsController.listDocumentTypesCustomer(req, res)
      const { error } = missingParamError("provided-customer")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)      
    })

    it("6.2 - Should return 200", async () => {
      const header = {
        'provided-customer': 1
      }
      const req = mocks.mockReq(null, null, null, null, header)
      const res = mocks.mockRes()
      await documentsController.listDocumentTypesCustomer(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          ...modelsExpected.documentsTypesModel()
        })
      ]))      
    })

    it("6.3 - Should return 200", async () => {
      const header = {
        'provided-customer': 0
      }
      const req = mocks.mockReq(null, null, null, null, header)
      const res = mocks.mockRes()
      await documentsController.listDocumentTypesCustomer(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          ...modelsExpected.documentsTypesModel()
        })
      ]))      
    })
  })

  describe("7 - CHANGE TYPE tests", () => {
    it("7.1 - Should return 400 if no id has been provided", async () => {
      const body = {
        typeId: documentType2.id,
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeType(req, res)

      const { error } = missingParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("7.2 - Should return 400 if no typeId has been provided", async () => {
      const body = {
        id: document.id,
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeType(req, res)

      const { error } = missingParamError("typeId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("7.3 - Should return 400 if invalid id has been provided", async () => {
      const body = {
        id: "Invalid ID",
        typeId: documentType2.id
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeType(req, res)

      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("7.4 - Should return 400 if invalid statusId has been provided", async () => {
      const body = {
        id: document.id,
        typeId: "INVALID STATUS ID"
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeType(req, res)

      const { error } = invalidParamError("typeId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.5 - Should return 200 if document type was updated", async () => {
      const body = {
        id: document.id,
        typeId: documentType2.id
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await documentsController.changeType(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([1])
    })
  })

  describe("8 - DELETE DOCUMENTS tests", () => {
    it("8.1 - Should return 400 if no id has been provided", async () => {
      	const req = mocks.mockReq()
        const res = mocks.mockRes()
        const { error } = missingParamError("x-document-id")
        await documentsController.deleteDocument(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
    })

    it("8.2 - Should return 400 if invalid id has been provided", async () => {
      const headers = {
        'x-document-id': "invalidID"
      }
      const req = mocks.mockReq(null, null, null, null, headers)
      const res = mocks.mockRes()
      const { error } = invalidParamError("x-document-id")
      await documentsController.deleteDocument(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("8.3 - Should return 200 if valid id has been provided", async () => {
      const headers = {
        'x-document-id': document.id
      }
      const req = mocks.mockReq(null, null, null, null, headers)
      const res = mocks.mockRes()
      await documentsController.deleteDocument(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(1)
    })
  })
})

