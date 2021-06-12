const { invalidParamError, missingParamError, forbidenError } = require('../../helpers/Errors')
const { AuthorizationMiddleware } = require('../../middlewares')
const authorizationMiddleware = new AuthorizationMiddleware()
const {User, Profile} = require('../../models')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()

const mockNext = () => {
  const next = jest.fn()
  return next
}


describe("AdminController tests", () => {
  const user = {}
  let profile 
  let profile2
  beforeAll(async () => {
    profile = await Profile.create(mocks.mockProfile("Administrador", true, false))
    const userAdminCreated = await User.create(mocks.mockUser("admin", profile.id))
    user.tokenAdmin = await mocks.mockJwtToken(userAdminCreated.id)
    
    profile2 = await Profile.create(mocks.mockProfile("Corretor", false, false))
    const userCreated = await User.create(mocks.mockUser("user", profile2.id))
    user.token = await mocks.mockJwtToken(userCreated.id)

    })

  afterAll(async () => {
    try{
      await User.destroy({where: {}})
      await Profile.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe("CheckPrivileges tests", () => {
    test("Should return 400 if no jwt token was provided", async () => {
      const req =  mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await authorizationMiddleware.checkAdminPrivileges(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('authorization')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 403 if user has no privileges', async () => {
      const req = mocks.mockReq()
      req.headers = {
        authorization: `Bearer ${user.token}`
      }
      const res = mocks.mockRes()
      await authorizationMiddleware.checkAdminPrivileges(req, res)
      expect(res.status).toHaveBeenCalledWith(403)
      const {error} = forbidenError()
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should call next function if user has admin privileges', async () => {
      const req = mocks.mockReq()
      req.headers = {
        authorization: `Bearer ${user.tokenAdmin}`
      }
      const res = mocks.mockRes()
      const next = mockNext()
      await authorizationMiddleware.checkAdminPrivileges(req, res, next)
      expect(res.status).not.toHaveBeenCalledWith(403)
      expect(next).toHaveBeenCalled()
    })
  })

})