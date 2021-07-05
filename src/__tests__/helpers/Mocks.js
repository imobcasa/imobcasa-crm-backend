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

  mockReq = (body = {}, query = {}, params = {}, locals = {}, headers = {}, file) => {
    return {
      body: body,
      query: query,
      params: params,
      locals: locals,
      headers: headers,
      file
    }
  }

  mockUser(
    username = "mockedUser",
    profileId = "",
    managerId = "",
    fullName = "ValidFullName"
  ) {
    return {
      username,
      fullName,
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
      'x-user-id': id
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


  mockCustomer(userId = "", statusId = "", phone = "11912341234", fullName = "CustomerFullName") {
    return {
      fullName,
      cpf: "00000000000",
      email: "customer@email.com",
      phone,
      birthDate: new Date(),
      incomes: 100000.15,
      startDate: new Date(),
      origin: "Facebook",
      productInterest: "Tatuapé",
      regionInterest: "Leste",
      biddersQuantity: 1,
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

  mockSale(customerId = ""){
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

  mockDocumentTypes(name = "Ficha", providedByCustomer = false, key = "FORM_DOC") {
    return {
      name,
      providedByCustomer,
      key
    }
  }

  mockDocumentStatuses(name = "Em análise", order = 1, key = "ANALISIS") {
    return {
      name,
      order,
      key
    }
  }

  mockDocument(
    originalName = "",
    path = "",
    typeId,
    statusId,
    size,
    customerId
  ) {
    return {
      name: originalName,
      url: path,
      typeId,
      statusId,
      size,
      customerId
    }
  }

}

module.exports = Mocks