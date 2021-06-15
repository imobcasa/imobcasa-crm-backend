const { Users } = require('../../models')
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

  mockUser(
    username = "mockedUser",
    profileId = "",
    managerId = ""
  ) {
    return {
      username,
      fullName: "ValidFullName",
      email: "valid@email.com",
      phone: '11912341234',
      password: "validPassword",
      profileId,
      managerId
    }
  }

  mockProfile(name = "", admin = false, teamManager = false) {
    return {
      name,
      admin,
      teamManager
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
    const user = await Users.findOne({ where: { id: id }, include: ['profile'] })
    return await jwtImplementation.generateAccessToken(user.id, user.profile.admin)
  }

  async mockRefreshToken(id) {
    const jwtImplementation = new JwtImplementation()
    const user = await Users.findOne({ where: { id: id } })
    return await jwtImplementation.generateRefreshToken(user.id, user.admin)
  }


  mockCustomer(userId = "", statusId = "", phone = "11912341234") {
    return {
      fullName: "Customer Full Name",
      cpf: "00000000000",
      email: "customer@email.com",
      phone,
      birthDate: new Date(),
      incomes: 100000.15,
      startDate: new Date(),
      origin: "Facebook",
      productInterest: "Tatuapé",
      regionInterest: "Leste",
      biddersQuatity: 1,
      userId,
      statusId
    }
  }

  mockCustomerStatus(name = "", order = 1, key = "") {
    return {
      name,
      order,
      key,
    }
  }

  mockSale(customerId){
    return {
      customerId,
      projectName: "ProjectMock",
      unityName: "unityMock",
      tower: "towerMock",
      value: 10000.00,
      observations: "ObservatiomMock",
    }
  }

  mockUsersSales(userId, saleId){
    return {
      userId,
      saleId
    }
  }

}

module.exports = Mocks