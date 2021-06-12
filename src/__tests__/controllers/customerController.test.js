const { CustomerController } = require('../../controllers')
const { User, Customer, Profile } = require('../../models')
const missingParamError = require('../../helpers/Errors/missing-param-errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const customerController = new CustomerController

const databaseSetup = require('../../database')

describe("CUSTOMER CONTROLLER Tests", () => {
  let user
  let profile

  let customer
  beforeAll(async () => {
    try{
      await databaseSetup()
      profile = await Profile.create(mocks.mockProfile("Administrador", true, false))
      user = await User.create(mocks.mockUser("mockedUser", profile.id))
      customer = await Customer.create(mocks.mockCustomer(user.id))
    }catch(err){
      console.log(err)
    }
  })
  
  afterAll(async () => {
    try{
      await Customer.destroy({ where: {} })
      await User.destroy({where: {}})
      await Profile.destroy({where: {}})
    }catch(err){
      console.log(err.toString())
    }
  })
  


  describe('LIST Tests', () => {

    const requiredFields = ['x-status', 'reqUserId', 'admin']
    it('Should return 400 if no x-status has been provided', async () => {
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

  })

})