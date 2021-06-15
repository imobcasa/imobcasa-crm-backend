const { SalesController } = require('../../controllers')
const {missingParamError, invalidParamError, forbidenError, conflictError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const salesController = new SalesController

const Setup = require('../helpers/Setups')
const setupTests = new Setup()


describe("SALES Controller Tests", () => {
  let sale
  let customer
  let user
  let profile
  let customerStatus
  let user2
  let profile2


  beforeAll(async () => {
    await setupTests.databaseSetup()
    profile = await setupTests.generateProfile("Administrador", true, false)
    user = await setupTests.generateUser("mockedUser", profile.id)

    profile2 = await setupTests.generateProfile("Corretor", true, false)
    user2 = await setupTests.generateUser("user2", profile2.id)

    customerStatus = await setupTests.generateCustomerStatus("Pendente de Documentação", 1, "DOC_PENDING")
    customer = await setupTests.generateCustomer(user.id, customerStatus.id)

    const { sale: saleGenerated, usersSales } = await setupTests.generateSale(customer.id, [user.id, user2.id])
    
    sale = saleGenerated


  })

  afterAll(async () => {
    await setupTests.destroySales()
    await setupTests.destroyCustomers()
    await setupTests.destroyCustomerStatuses()
    await setupTests.destroyUsers()
    await setupTests.destroyProfiles()
  })


  describe("GET ONE tests", () => {

    it("Should return 400 if no x-sale-id has not been provided", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()

      const { error }  = missingParamError("x-sale-id")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("Should return 400 if no reqUserId has not been provided", async () => {
      const req = mocks.mockReq(null, null, null, {
        "admin": true
      }, {
        'x-sale-id': sale.id
      })
      const res = mocks.mockRes()

      const { error }  = missingParamError("reqUserId")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("Should return 400 if no admin has not been provided", async () => {
      const req = mocks.mockReq(null, null, null, {
        "reqUserId": user.id
      }, {
        'x-sale-id': sale.id
      })
      const res = mocks.mockRes()

      const { error }  = missingParamError("admin")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
  })


  // describe("POST tests", () => {
    
  // })


  // describe("PUT tests", () => {
    
  // })

  // describe("DELETE tests", () => {
    
  // })


})
