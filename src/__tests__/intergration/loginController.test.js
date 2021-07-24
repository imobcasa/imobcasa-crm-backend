const {LoginController} = require('../../controllers')
const loginController = new LoginController()
const { invalidParamError, missingParamError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected

const Setup = require('../helpers/Setups')
const setupTests = new Setup()


describe('AUTH CONTROLLER: tests', () => {
  let user
  let profile
  beforeAll(async () => {
    try{
      await setupTests.databaseSetup()
      profile = await setupTests.generateProfile("Administrador", true, false)
      user = await setupTests.generateUser("mockedUser", profile.id)
    }catch(err){
      console.log(err)
    }
  })
  
  afterAll(async () => {
    try{
      await setupTests.destroyUsers()
      await setupTests.destroyProfiles()
    }catch(err){
      console.log(err.toString())
    }
  })
  

  describe('USERAUTHENTICATION', () => {
    const requiredFields = ['username', 'password']
    for(const field of requiredFields){
      it(`Should return 400 if no ${field} was provided`, async () => {
        const fakeUser = mocks.mockUser()
        delete fakeUser[`${field}`]
        const req = mocks.mockReq(fakeUser)
        const res = mocks.mockRes()
        await loginController.authenticate(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(error)
      })  
    }
    for(const field of requiredFields){
      it(`Should return 401 if invalid ${field} username has been send`, async () => {
        const fakeUser = mocks.mockUser()
        fakeUser[`${field}`] = 'invalidParameter'
        const req = mocks.mockReq(fakeUser)
        const res = mocks.mockRes()  
        await loginController.authenticate(req, res)
        const { error } = invalidParamError('Username or Password')
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toBeCalledWith(error)
      })
    }
    it('Should return 200 if valid password and username has been send', async () => {
      const {username, password} = mocks.mockUser()
      const req = mocks.mockReq({username, password})
      const res = mocks.mockRes()
      await loginController.authenticate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.loginExpected()))
    })
  })

  describe("REFRESH TOKEN Tests", () => {
    it("Should return 400 if no refreshToken has been provided", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await loginController.refreshToken(req, res)
      const { error } = missingParamError("refreshToken")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it("Should return 401 if invalid refreshToken has been provided", async () => {
      const body = {
        refreshToken: "InvalidRefreshToken"
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      await loginController.refreshToken(req, res)
      const { error } = invalidParamError("token")
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    //Tests of invalid id token decoded
    //Tests of inactivated user in token decoded

    it("Should return 200 if valid refreshToken has been provided", async () => {
      
      const refreshToken = await mocks.mockRefreshToken(user.id)
      const body = {
        refreshToken
      }
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      await loginController.refreshToken(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.loginExpected()
      }))
    })
  })
})