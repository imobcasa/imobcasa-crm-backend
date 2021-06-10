const { User } = require('../../models')
const JwtImplementation = require('../../implementations/jwt')


class Mocks {


  mockNext = () => {
    const next = jest.fn()
    return next
  }

  mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)
    return res
  };

  mockReq = (body = {}, query = {}, params = {}, locals = {}, headers = {}) => {
    return {
      body: body,
      query: query,
      params: params,
      locals: locals,
      headers: headers      
    }
  }

  mockUser(admin = true, username = "mockedUser") {
    return {
      username: username,
      fullName: "ValidFullName",
      email: "valid@email.com",
      password: "validPassword",
      passwordConfirmation: "validPassword",
      admin: admin,
      active: true,
    }
  }

  mockPwdChange(password, newPassword) {
    return {
      password,
      newPassword
    }
  }

  mockPwdReset(password, id) {
    return {
      password,
      id
    }
  }


  async mockJwtToken(id) {
    const jwtImplementation = new JwtImplementation()
    const user = await User.findOne({ where: { id: id } })
    return await jwtImplementation.generateAccessToken(user.id, user.admin)
  }

  async mockRefreshToken(id) {
    const jwtImplementation = new JwtImplementation()
    const user = await User.findOne({ where: { id: id } })
    return await jwtImplementation.generateRefreshToken(user.id, user.admin)
  }

}

module.exports = Mocks