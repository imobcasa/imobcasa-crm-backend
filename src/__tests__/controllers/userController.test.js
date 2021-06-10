const { UserController } = require('../../controllers')
const userController = new UserController()
const databaseSetup = require('../../database')
const { missingParamError, invalidParamError } = require('../../helpers/Errors')
const { User } = require('../../models')
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
  let userId = ""
  let userPwd = "validPassword"
  beforeAll(async () => {
    try {
      const user = await User.create(mocks.mockUser())
      userId = user.id
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  describe('POST User tests', () => {
    const requiredFields = ['fullName', 'username', 'email', 'password', 'admin', 'active']
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
      const user = mocks.mockUser()
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })

  describe('GET User tests', () => {
    test('GET: Should return 200', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await userController._list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.userModel())]))
    })
  })

  describe('PUT User tests', () => {
    test('PUT: Should return 400 if no id has beem send', async () => {
      const user = mocks.mockUser()
      delete user.username
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
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
    test('PUT: Should return 200 username has beem updated', async () => {
      const user = mocks.mockUser()
      user.id = userId
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })

  describe('CHANGE PWD tests', () => {
    const requiredFields = ['password', 'newPassword']
    for (const field of requiredFields) {
      test(`Should return 400 if no ${field} has been provided`, async () => {
        const body = mocks.mockPwdChange("validPassword", "newValidPassword")
        const locals = {
          reqUserId: userId,
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
        reqUserId: userId,
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
        reqUserId: userId,
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
        reqUserId: userId,
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
        reqUserId: userId,
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
      const body = mocks.mockPwdReset("newPassword", userId)
      delete body.id
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = missingParamError('id')
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if no password has been provided`, async () => {
      const body = mocks.mockPwdReset("newPassword", userId)
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
      const body = mocks.mockPwdReset("newValidPassword", userId)
      const req = mocks.mockReq(body)
      const res = mocks.mockRes()
      const { error } = invalidParamError('password')
      await userController.resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 204 if password has been changed`, async () => {
      const body = mocks.mockPwdReset("newPasswordReset", userId)
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
      const req = mocks.mockReq(null, null, { id: userId }, null)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(1)
    })
  })

  describe('GET USER BY ID', () => {
    let userId = ""
    beforeAll(async () => {
      try {
        const user = await User.create(mocks.mockUser())
        userId = user.id
      } catch (err) {
        console.log(err)
      }
    })

    afterAll(async () => {
      try {
        await User.destroy({ where: {} })
      } catch (err) {
        console.log(err)
      }
    })

    test("Should return 400 if no id has been send", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid id has been send", async () => {
      const req = mocks.mockReq(null, null, { id: "invalid user id" }, null)
      const res = mocks.mockRes()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 if user has been found', async () => {
      const req = mocks.mockReq(null, null, { id: userId }, null)
      const res = mocks.mockRes()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })
})
