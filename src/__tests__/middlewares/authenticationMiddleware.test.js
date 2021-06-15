const AuthMiddleware = require("../../middlewares/AuthenticationMiddleware")
const authMiddleware = new AuthMiddleware()
const { invalidParamError, missingParamError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const mocks = new Mocks()

const Setup = require('../helpers/Setups')
const setupTests = new Setup()

describe('AUTH CONTROLLER: tests', () => {
  let user
  let profile
  beforeAll(async () => {
    try{
      await setupTests.databaseSetup()
      profile = await setupTests.generateProfile("Administrador", true, false)
      user = await setupTests.generateUser("admin", profile.id)
    }catch(err){
      console.log(err.toString())
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
  

  describe('CHECKAUTHENTICATION', () => {
    it('should return 400 if no jwt token was provided', async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await authMiddleware.checkAuthentication(req, res)
      const { error } = missingParamError('authorization')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)
    });
    it('should return 400 if malformated authorization Header has been provided ', async () => {
      const req =  mocks.mockReq()
      req.headers = {
        authorization: "InvalidJWT"
      }
      const res = mocks.mockRes()
      await authMiddleware.checkAuthentication(req, res)
      const { error } = invalidParamError('token')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)      
    });
    it('should return 401 if invalid token has been provided ', async () => {
      const req =  mocks.mockReq()
      req.headers = {
        authorization: "Bearer invalidJWT"
      }
      const res = mocks.mockRes()
      await authMiddleware.checkAuthentication(req, res)
      const { error } = invalidParamError('token')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toBeCalledWith(error)      
    });
    it('should call next if valid jwt token was provided', async () => {
      const jwt = await mocks.mockJwtToken(user.id)
      const req =  mocks.mockReq()
      req.headers = {
        authorization: `Bearer ${jwt}`
      }
      const res = mocks.mockRes()
      const next = mocks.mockNext()
      await authMiddleware.checkAuthentication(req, res, next)
      expect(res.status).not.toHaveBeenCalledWith(401)
      expect(next).toHaveBeenCalled()
    })
  });
  
})