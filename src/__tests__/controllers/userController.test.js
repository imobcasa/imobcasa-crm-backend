const { UserController } = require('../../controllers')
const userController = new UserController()
const { missingParamError, invalidParamError, forbidenError } = require('../../helpers/Errors')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()

const Setup = require('../helpers/Setups')
const setupTests = new Setup()

describe('USER CONTROLLER: tests', () => {
  let profile
  let user
  let token

  let profile2
  let user2

  beforeAll(async () => {
    try {
      await setupTests.databaseSetup()
      profile = await setupTests.generateProfile("Administrador", true, false)
      user = await setupTests.generateUser("Administrador", profile.id, null, true, "Administrador")
      token = await mocks.mockJwtToken(user.id)

      profile2 = await setupTests.generateProfile("Corretor", true, false)
      user2 = await setupTests.generateUser("user2", profile2.id, null, true, "Corretor")
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await setupTests.destroyUsers()
      await setupTests.destroyProfiles()
    } catch (err) {
      console.log(err)
    }
  })

  describe.only("LIST User tests", () => {
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

    it("Should return 200 if x-query has been provided", async () => {
      const req = mocks.mockReq(null, null, null, null, {
        'Authorization': 'Bearer ' + token,
        'x-profiles': [profile.name.toUpperCase(), profile2.name.toUpperCase()],
        'x-query': 'Admin'

      })
      const res = mocks.mockRes()
      await userController._list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        fullName: 'Administrador'
      })]))
      expect(res.json).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        fullName: 'Corretor'
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
    test(`POST: Should return 400 if invalid managerId has beem send`, async () => {
      const user = mocks.mockUser()
      user.managerId = "INVALID MANAGER ID"
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._create(req, res)
      const { error } = invalidParamError("managerId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)
    })

    test(`POST: Should return 400 if invalid profileId has beem send`, async () => {
      const user = mocks.mockUser()
      user.profileId = "INVALID PROFILE ID"
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._create(req, res)
      const { error } = invalidParamError("profileId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)
    })
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
    test('Should return 400 if no x-user-id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('x-user-id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 400 if invalid x-user-id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, null, null, {
        'x-user-id': "INVALID"
      })
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('x-user-id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 if valid id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, null, null, {
        'x-user-id': user.id
      })
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        fullName: expect.any(String),        
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

  describe("UPDATE MY USER tests", () => {
    const requiredFields = ['fullName', 'email', 'phone', 'username']
    for(const field of requiredFields){
      it(`Should return 400 if no ${field} has been provided`, async () => {
        const locals = {
          reqUserId: user.id
        }
        const {
          fullName,
          username,
          email,
          phone
        } = mocks.mockUser()
        const data = {
          fullName,
          username,
          email,
          phone,
        }

        delete data[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(data, null, null, locals)
        await userController._updateMyUserData(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(error)
      })
    }
    it(`Should return 400 if invalid id has been provided`, async () => {
      const locals = {
        reqUserId: "INVALID ID"
      }
      const {
        fullName,
        username,
        email,
        phone
      } = mocks.mockUser()
      const data = {
        fullName,
        username,
        email,
        phone,
        id: "INVALID ID"
      }

      const res = mocks.mockRes()
      const req = mocks.mockReq(data, null, null, locals)
      await userController._updateMyUserData(req, res)
      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)
    })

    it(`Should return 200 if user was updated`, async () => {
      const locals = {
        reqUserId: user.id
      }
      const {
        fullName,
        username,
        email,
        phone
      } = mocks.mockUser()
      const data = {
        fullName: "ADministrador novo nome",
        username,
        email,
        phone,
        id: user.id
      }

      const res = mocks.mockRes()
      const req = mocks.mockReq(data, null, null, locals)
      await userController._updateMyUserData(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith([1])
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
      delete body['x-user-id']
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = missingParamError('x-user-id')
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
      const { error } = missingParamError("x-user-id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)
    })
    test('DELETE: Should return 400 if invalid id has beem send', async () => {
      const user = mocks.mockUser()
      user.id = 'invalidId'
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, null, null, {
        'x-user-id': "invalid userID"
      })
      await userController._delete(req, res)
      const { error } = invalidParamError("x-user-id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('DELETE: Should return 200 username has beem deleted by id', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, null, null, {
        'x-user-id': user2.id
      })
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(1)
    })
  })

})
