const { CustomerController } = require('../../controllers')
const { missingParamError, invalidParamError, forbidenError, conflictError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const customerController = new CustomerController

const Setup = require('../helpers/Setups')
const setupTests = new Setup()


describe("CUSTOMER CONTROLLER Tests", () => {
  let user
  let profile
  let user2
  let profile2

  let customerStatus
  let customer
  let customerStatus2
  let customer2
  beforeAll(async () => {
    try {
      await setupTests.databaseSetup()
      profile = await setupTests.generateProfile("Administrador", true, false)
      user = await setupTests.generateUser("mockedUser", profile.id)

      profile2 = await setupTests.generateProfile("Corretor", false, false)
      user2 = await setupTests.generateUser("mockedUser", profile2.id)
      customerStatus = await setupTests.generateCustomerStatus("Pendente de Documentação", 1, "DOC_PENDING")
      customer = await setupTests.generateCustomer(user.id, customerStatus.id)
      customerStatus2 = await setupTests.generateCustomerStatus("Documentação em análise", 2, "DOC_ANALISIS")
      customer2 = await setupTests.generateCustomer(user.id, customerStatus2.id)
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await setupTests.destroyCustomers()
      await setupTests.destroyCustomerStatuses()
      await setupTests.destroyUsers()
      await setupTests.destroyProfiles()
    } catch (err) {
      console.log(err.toString())
    }
  })



  describe('1 - LIST Tests', () => {

    it('1.1 - Should return 400 if no x-status has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      })
      const res = mocks.mockRes()
      await customerController._list(req, res)
      const { error } = missingParamError("x-status")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('1.2 - Should return 400 if no reqUserId has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        admin: true
      }, {
        'x-status': 'DOC_PENDING'
      })
      const res = mocks.mockRes()
      await customerController._list(req, res)
      const { error } = missingParamError("reqUserId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('1.3 - Should return 400 if no admin has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
      }, {
        'x-status': 'DOC_PENDING'
      })
      const res = mocks.mockRes()
      await customerController._list(req, res)
      const { error } = missingParamError("admin")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('1.4 - Should return 400 if invalid x-status has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-status': 'INVALID_STATUS'
      })
      const res = mocks.mockRes()
      await customerController._list(req, res)
      const { error } = invalidParamError("x-status")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('1.5 - Should return 200 and list of customers only x-status provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-status': 'DOC_PENDING'
      })
      const res = mocks.mockRes()
      await customerController._list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        statusId: customerStatus2.id
      })]))
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        statusId: customerStatus.id
      })]))
    })
  })

  describe("2 - CREATE Tests", () => {
    const requiredFields = [
      "fullName",
      "cpf",
      "email",
      "phone",
      "birthDate",
      "incomes",
      "startDate",
      "origin",
      "productInterest",
      "regionInterest",
      "biddersQuatity",
      "userId"
    ]

    let fieldsOrder = 1
    for (const field of requiredFields) {
      it(`2.1.${fieldsOrder} - Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockCustomer(user.id, customerStatus2.id)
        delete body[`${field}`]
        const req = mocks.mockReq(body)
        const res = mocks.mockRes()

        const { error } = missingParamError(field)
        await customerController._create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
      fieldsOrder += 1
    }

    it('2.2 - Should return 400 if invalid userId has been provided', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      body.userId = "INVALIDID"
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      const { error } = invalidParamError('userId')
      await customerController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('2.3 - Should return 409 if phone provided is already used', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      await customerController._create(req, res)
      const { error } = conflictError("phone")
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('2.4 - Should return 200 user was created', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      body.phone = "1100000000"
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      console.log(req)
      await customerController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.customerModel()))
    })

  })

  describe("3 - GET ONE Tests", () => {
    it('3.1 - Should return 400 if no x-customer-id has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      })
      const res = mocks.mockRes()
      await customerController._getOne(req, res)
      const { error } = missingParamError('x-customer-id')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('3.2 - Should return 400 if no reqUserId has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        admin: true
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()
      await customerController._getOne(req, res)
      const { error } = missingParamError('reqUserId')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('3.3 - Should return 400 if no admin has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()
      await customerController._getOne(req, res)
      const { error } = missingParamError('admin')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('3.4 - Should return 400 if invalid x-customer-id has been provided', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-customer-id': "INVALIDCUSTOMERID"
      })
      const res = mocks.mockRes()
      await customerController._getOne(req, res)
      const { error } = invalidParamError('x-customer-id')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('3.5 - Should return 401 if requserId provided is not equal of customer userId', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user2.id,
        admin: false
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()
      await customerController._getOne(req, res)
      const { error } = forbidenError('id')
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('3.6 - Should return 200', async () => {
      const req = mocks.mockReq(null, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()
      await customerController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.customerModel()))
    })
  })

  describe("4 - UPDATE Tests", () => {
    it('4.1 - Should return 400 if no x-customer-id has been provided', async () => {
      const body = mocks.mockCustomer(mocks.mockCustomer(user.id, customerStatus.id))
      body.phone = "11098765432"
      const req = mocks.mockReq(body, null, null, {
        reqUserId: user.id,
        admin: false
      }, {
      })
      const res = mocks.mockRes()

      await customerController._update(req, res)
      const { error } = missingParamError("x-customer-id")

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    const requiredFields = [
      "fullName",
      "cpf",
      "email",
      "phone",
      "birthDate",
      "incomes",
      "startDate",
      "origin",
      "productInterest",
      "regionInterest",
      "biddersQuatity",
      "userId"
    ]

    let fieldsOrder = 1
    for (const field of requiredFields) {
      it(`4.2.${fieldsOrder} - Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockCustomer(user.id, customerStatus2.id)
        delete body[`${field}`]
        const req = mocks.mockReq(body, null, null, {
          reqUserId: user.id,
          admin: false
        }, {
          'x-customer-id': customer.id
        })
        const res = mocks.mockRes()

        const { error } = missingParamError(field)
        await customerController._create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
      fieldsOrder += 1
    }
    it('4.3 - Should return 400 if invalid x-customer-id has been provided', async () => {
      const body = mocks.mockCustomer(mocks.mockCustomer(user.id, customerStatus.id))
      body.phone = "11098765432"
      const req = mocks.mockReq(body, null, null, {
        reqUserId: user.id,
        admin: false
      }, {
        'x-customer-id': "INVALID"
      })
      const res = mocks.mockRes()

      await customerController._update(req, res)
      const { error } = invalidParamError("x-customer-id")

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('4.3 - Should return 403 if reqUserId is not equal of userId of customer finded', async () => {
      const body = mocks.mockCustomer(mocks.mockCustomer(user.id, customerStatus.id))
      body.phone = "11098765432"
      const req = mocks.mockReq(body, null, null, {
        reqUserId: user2.id,
        admin: false
      }, {
        'x-customer-id': customer.id
      })
      const res = mocks.mockRes()

      await customerController._update(req, res)
      const { error } = forbidenError()

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('4.4 - Should return 200 if reqUserId is not equal of userId of customer finded but user id admin', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      body.phone = "11098765432"
      const req = mocks.mockReq(body, null, null, {
        reqUserId: user2.id,
        admin: true
      }, {
        'x-customer-id': customer.id
      })

      const res = mocks.mockRes()

      await customerController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.customerModel(),
        phone: "11098765432"
      }))
    })

    it('4.5 - Should return 409 if phone provided is already used', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      const req = mocks.mockReq(body, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-customer-id': customer.id
      })

      const res = mocks.mockRes()

      const { error } = conflictError("phone")
      await customerController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('4.6 - Should return 200 if user was updated', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      body.phone = "11098765434"
      const req = mocks.mockReq(body, null, null, {
        reqUserId: user.id,
        admin: true
      }, {
        'x-customer-id': customer.id
      })

      const res = mocks.mockRes()

      await customerController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.customerModel(),
        phone: "11098765434"
      }))
    })


  })

})



