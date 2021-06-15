const { SalesController } = require('../../controllers')
const { missingParamError, invalidParamError, forbidenError, conflictError } = require('../../helpers/Errors')
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


  describe("1 - GET ONE tests", () => {

    it("1.1 - Should return 400 if no x-customer-id has not been provided", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()

      const { error } = missingParamError("x-customer-id")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("1.2 - Should return 400 if no reqUserId has not been provided", async () => {
      const req = mocks.mockReq(null, null, null, {
        "admin": true
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()

      const { error } = missingParamError("reqUserId")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("1.3 - Should return 400 if no admin has not been provided", async () => {
      const req = mocks.mockReq(null, null, null, {
        "reqUserId": user.id
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()

      const { error } = missingParamError("admin")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it("1.4 - Should return 400 if invalid id has been provided", async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-customer-id': "INVALID SALE ID"
      })
      const res = mocks.mockRes()

      const { error } = invalidParamError("x-customer-id")
      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it("1.5 - Should return 200 if valid data has been provided", async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()

      await salesController.getSale(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.saleModel()
      }))
    })
  })


  describe("2 - POST tests", () => {
    const requiredFields = [
      "customerId",
      "projectName",
      "unityName",
      "tower",
      "value",
      "observations",
      "usersIds"
    ]
    let testPos = 1
    for (const field of requiredFields) {
      it(`2.1.${testPos} Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockSale(customer.id)
        body.usersIds = [user.id, user2.id]


        delete body[`${field}`]
        const req = mocks.mockReq(body)
        const res = mocks.mockRes()

        const { error } = missingParamError(field)
        await salesController.createSale(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
      testPos += 1
    }
    it("2.2 - Should return 400 if invalid customerId has been provided", async () => {
      const body = mocks.mockSale("INVALID CUSTOMER ID")
      body.usersIds = [user.id, user2.id]
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError("customerId")
      await salesController.createSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
  })


  // describe("PUT tests", () => {

  // })

  // describe("DELETE tests", () => {

  // })


})
