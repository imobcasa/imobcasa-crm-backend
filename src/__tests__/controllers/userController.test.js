const { UserController } = require('../../controllers')
const userController = new UserController()
const databaseSetup = require('../../database')
const { missingParamError, invalidParamError } = require('../../helpers/Errors')
const { User, Profile } = require('../../models')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()

beforeAll(async () => {
  try {
    await databaseSetup()
  } catch (err) {
    console.log(err.toString())
  }
})

describe('USER CONTROLLER: tests', () => {
  let profile
  let user
  let token

  let profile2
  let user2
  // let userId = ""
  // let userPwd = "validPassword"

  beforeAll(async () => {
    try {
      profile = await Profile.create(mocks.mockProfile("Administrador", true, false))
      user = await User.create(mocks.mockUser("administrador", profile.id), { raw: true })
      token = await mocks.mockJwtToken(user.id)

      profile2 = await Profile.create(mocks.mockProfile("Corretor", true, false))
      user2 = await User.create(mocks.mockUser("user2", profile2.id))
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
      await Profile.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  describe("LIST User tests", () => {
    it("Should return 400 if no x-profile Header has been provided", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'Authorization': 'Bearer ' + token
      })
      const res = mocks.mockRes()
      await userController._list(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('x-profiles')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it("Should return 400 if x-profile Header has been provided without values", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'Authorization': 'Bearer ' + token,
        'x-profiles': null
      })
      const res = mocks.mockRes()
      await userController._list(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('x-profiles')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it("Should return 200 if profile has been provided and with users of profile provided", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'Authorization': 'Bearer ' + token,
        'x-profiles': [profile2.name.toUpperCase()]
      })
      const res = mocks.mockRes()
      await userController._list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        username: user2.username,
        profileId: user2.profileId
      })]))
      expect(res.json).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        username: user.username,
        profileId: user.profileId
      })]))
    })
  })

  describe('CREATE USER Tests', () => {
    const requiredFields = ['fullName', 'username', 'profileId', 'password']
    for (const field of requiredFields) {
      test(`POST: Should return 400 if no ${field} has beem send`, async () => {
        const user = mocks.mockUser()
        delete user[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(user)
        await userController._create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(`MissingParamError: ${field}`)
      })
    }
    test('POST: Should return 200 if user has been created', async () => {
      const user = mocks.mockUser("newUser", profile.id)
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })

  describe('GET USER Tests', () => {
    test('Should return 400 if no id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 400 if invalid id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {
        id: "invalidId"
      })
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 if valid id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {
        id: user.id
      })
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        fullName: expect.any(String),        
        managerId: expect.any(String),
        phone: expect.any(String),
        profile: expect.objectContaining({                    
          id: expect.any(String),
          name: expect.any(String),
          admin: expect.any(Boolean),
          teamManager: expect.any(Boolean),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
        profileId: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        username: expect.any(String),
      }))
    })
  })

  describe('UPDATE User tests', () => {
    test('PUT: Should return 400 if no id has beem send', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('MissingParamError: id')
    })
    test('PUT: Should return 400 if invalid id has beem send', async () => {
      const user = mocks.mockUser()
      user.id = 'invalidId'
      user.username = 'invalidUsername'
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('PUT: Should return 200 user has beem updated', async () => {
      const userToUpdate = {
        id: user.id,
        username: "AdminUsernameUpdated",
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileId: profile2.id,
        managerId: ""
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(userToUpdate)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        username: "AdminUsernameUpdated",
        profileId: profile2.id
      }))
    })
  })

  describe('CHANGE PWD tests', () => {
    const requiredFields = ['password', 'newPassword']
    for (const field of requiredFields) {
      test(`Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockPwdChange("validPassword", "newValidPassword")
        const locals = {
          reqUserId: user.id,
          admin: true
        }
        delete body[`${field}`]
        const req = mocks.mockReq(body, null, null, locals)
        const res = mocks.mockRes()
        const { error } = missingParamError(field)
        await userController.changePassword(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if no reqUserID has been provided`, async () => {
      const body = mocks.mockPwdChange("validPassword", "newValidPassword")
      const locals = {
        admin: true
      }
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      const { error } = missingParamError('reqUserId')
      await userController.changePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)

    })
    test(`Should return 400 if no admin has been provided`, async () => {
      const body = mocks.mockPwdChange("validPassword", "newValidPassword")
      const locals = {
        reqUserId: user2.id,
      }
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      const { error } = missingParamError('admin')
      await userController.changePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)

    })
    test("Should return 400 if invalid requserId has been provided", async () => {
      const body = mocks.mockPwdChange("validPassword", "newValidPassword")
      const locals = {
        reqUserId: "invalid userID",
        admin: true
      }
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      const { error } = invalidParamError('reqUserId')
      await userController.changePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 401 if invalid password has been provided", async () => {
      const body = mocks.mockPwdChange("invalidPassword", "newValidPassword")
      const locals = {
        reqUserId: user.id,
        admin: true
      }
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      const { error } = invalidParamError('password')
      await userController.changePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid newPassword has been provided", async () => {
      const body = mocks.mockPwdChange("validPassword", "validPassword")
      const locals = {
        reqUserId: user.id,
        admin: true
      }
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      const { error } = invalidParamError('password')
      await userController.changePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 204 if password has been changed", async () => {
      const body = mocks.mockPwdChange("validPassword", "newValidPassword")
      const locals = {
        reqUserId: user.id,
        admin: true
      }
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await userController.changePassword(req, res)
      expect(res.status).toHaveBeenCalledWith(204)
    })
  })

  describe('RESET PWD tests', () => {
    test(`Should return 400 if no id has been provided`, async () => {
      const body = mocks.mockPwdReset("newPassword", user.id)
      delete body.id
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = missingParamError('id')
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if no password has been provided`, async () => {
      const body = mocks.mockPwdReset("newPassword", user.id)
      delete body.password
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = missingParamError('password')
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userId has been provided`, async () => {
      const body = mocks.mockPwdReset("newPassword", "InvalidUserID")
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError('id')
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid password has been provided`, async () => {
      const body = mocks.mockPwdReset("newValidPassword", user.id)
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError('password')
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 204 if password has been changed`, async () => {
      const body = mocks.mockPwdReset("newPasswordReset", user.id)
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(204)
    })
  })

  describe('DELETE User tests', () => {
    test('DELETE: Should return 400 if no id has beem send', async () => {
      const user = mocks.mockUser()
      delete user.id
      delete user.username
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('MissingParamError: id')
    })
    test('DELETE: Should return 400 if invalid id has beem send', async () => {
      const user = mocks.mockUser()
      user.id = 'invalidId'
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { id: "invalid user id" }, null)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('DELETE: Should return 200 username has beem deleted by id', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { id: user2.id }, null)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(1)
    })
  })

})
