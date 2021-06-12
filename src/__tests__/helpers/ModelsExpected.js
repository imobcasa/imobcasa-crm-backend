

class ModelsExpected {

  userModel() {
    return {
      fullName: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      profileId: expect.any(String),
      managerId: expect.any(String),    
    }
  }


  loginExpected() {
    return {
      id: expect.any(String),
      fullName: expect.any(String),
      username: expect.any(String),
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      }
    }
  }

  tokenExpected() {
    return {
      id: expect.any(String),
      fb_marketing_token: expect.any(String),
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date)
    }
  }

  
  customerModel() {
    return {
      id: expect.any(String),
      fullName: expect.any(String),
      cpf: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      birthDate: expect.any(Date),
      incomes: expect.any(Number),
      startDate: expect.any(Date),
      origin: expect.any(String),
      productInterest: expect.any(String),
      regionInterest: expect.any(String),
      biddersQuatity: expect.any(Number),
      userId: expect.any(String),
      statusId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    }
  }


}


module.exports = ModelsExpected
