const { CustomerController } = require('../../controllers')
const { User, Customer, Profile, CustomerStatuses } = require('../../models')
const {missingParamError, invalidParamError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const customerController = new CustomerController

const databaseSetup = require('../../database')

describe("CUSTOMER CONTROLLER Tests", () => {
  let user
  let profile

  let customerStatus
  let customer
  let customerStatus2
  let customer2
  beforeAll(async () => {
    try{
      await databaseSetup()
      profile = await Profile.create(mocks.mockProfile("Administrador", true, false))
      user = await User.create(mocks.mockUser("mockedUser", profile.id))

      customerStatus = await CustomerStatuses.create(mocks.mockCustomerStatus("Pendente de Documentação", 1, "DOC_PENDING"))
      customer = await Customer.create(mocks.mockCustomer(user.id, customerStatus.id))

      customerStatus2 = await CustomerStatuses.create(mocks.mockCustomerStatus("Documentação em análise", 2, "DOC_ANALISIS"))
      customer2 = await Customer.create(mocks.mockCustomer(user.id, customerStatus2.id))
    }catch(err){
      console.log(err)
    }
  })
  
  afterAll(async () => {
    try{
      await Customer.destroy({ where: {} })
      await CustomerStatuses.destroy({ where: {} })
      await User.destroy({where: {}})
      await Profile.destroy({where: {}})
    }catch(err){
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

    for(const field of requiredFields){
      it(`1.1 - Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockCustomer(user.id, customerStatus2.id)
        delete body[`${field}`]
        const req = mocks.mockReq(body)
        const res = mocks.mockRes()

        const { error } = missingParamError(field)
        await customerController._create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })      
    }

    it('1.2 - Should return 400 if invalid userId has been provided', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      body.userId = "INVALIDID"
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()

      const { error } = invalidParamError('userId')
      await customerController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    it('1.3 - Should return 200 user was created', async () => {
      const body = mocks.mockCustomer(user.id, customerStatus.id)
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      await customerController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.customerModel()))
    })

  })

  describe("3 - GET ONE Tests", () => {
    it('Should return 400 if no id has been provided', async () => {
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
  })

})


