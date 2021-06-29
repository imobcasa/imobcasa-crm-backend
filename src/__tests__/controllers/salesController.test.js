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
    await setupTests.destroySales()
    await setupTests.destroyCustomers()
    await setupTests.destroyCustomerStatuses()
    await setupTests.destroyUsers()
    await setupTests.destroyProfiles()

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

    it("2.3.1 - Should return 400 if invalid usersIds has been provided", async () => {
      const body = mocks.mockSale(customer.id)
      body.usersIds = ["Invalid", user2.id]
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError("usersIds")
      await salesController.createSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("2.3.2 - Should return 400 if invalid usersIds has been provided", async () => {
      const body = mocks.mockSale(customer.id)
      body.usersIds = [user.id, "INVALID USER ID"]
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError("usersIds")
      await salesController.createSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it("2.4 - Should return 200 if sale was created", async () => {
      const body = mocks.mockSale(customer.id)
      body.usersIds = [user.id, user2.id]
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      await salesController.createSale(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      const saleModelExpected = modelsExpected.saleModel()
      delete saleModelExpected.users
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ...saleModelExpected }))
    })
  })


  describe("3 - PUT tests", () => {
    const requiredFields = [
      "projectName",
      "unityName",
      "tower",
      "value",
      "observations",
      "usersIds",
      "id"
    ]
    let testPos = 1
    for (const field of requiredFields) {
      it(`3.1.${testPos} Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockSale()
        delete body.customerId
        body.usersIds = [user.id, user2.id]
        body.id = sale.id

        delete body[`${field}`]
        const req = mocks.mockReq(body)
        const res = mocks.mockRes()

        const { error } = missingParamError(field)
        await salesController.updateSale(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
      testPos += 1
    }

    it("3.2 - Should return 400 if invalid id has been provided", async () => {
      const body = mocks.mockSale(customer.id)
      body.usersIds = [user.id, user2.id]
      body.id = "INVALIDSALEID"
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError("id")
      await salesController.updateSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.3.1 - Should return 400 if invalid usersIds has been provided", async () => {
      const body = mocks.mockSale(customer.id)
      body.usersIds = ["Invalid", user2.id]
      body.id = sale.id
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError("usersIds")
      await salesController.updateSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.3.2 - Should return 400 if invalid usersIds has been provided", async () => {
      const body = mocks.mockSale(customer.id)
      body.usersIds = [user.id, "INVALID USER ID"]
      body.id = sale.id
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError("usersIds")
      await salesController.updateSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("3.4 - Should return 200 if sale was updated", async () => {
      const body = mocks.mockSale()
      body.usersIds = [user.id, user2.id]
      body.id = sale.id
      body.value = 12000.00
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      await salesController.updateSale(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([1])
    })   
  })

  describe("4 - DELETE tests", () => {
    
    it("4.1 - Should return 400 if no id has been provided", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      const { error } = missingParamError("x-sale-id")
      await salesController.deleteSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("4.2 - Should return 400 if invalid id has been provided", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'x-sale-id': "INVALIDID"
      })
      const res = mocks.mockRes()
      const { error } = invalidParamError("x-sale-id")
      await salesController.deleteSale(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it("4.3 - Should return 200 if sale was deleted", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'x-sale-id': sale.id
      })
      const res = mocks.mockRes()
      await salesController.deleteSale(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(1)
    })
  })

  describe("5 - getUsersAvailable tests", () => {
    it('5.1 - Should return 200 with array of seller users', async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await salesController.getUsersAvailable(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          fullName: expect.any(String),
          id: expect.any(String)
        })
      ]))
    })
  })


})
