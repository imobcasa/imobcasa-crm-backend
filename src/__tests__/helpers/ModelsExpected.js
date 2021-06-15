

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

  saleModel(){
    return {
      id: expect.any(String),
      customerId: expect.any(String),
      projectName: expect.any(String),
      unityName: expect.any(String),
      tower: expect.any(String),
      value: expect.any(String),
      observations: expect.any(String),
      users: expect.arrayContaining([expect.objectContaining({
        id: expect.any(String),
        fullName: expect.any(String),
        username: expect.any(String),
      })]),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)

    }
  }

  usersSalesModel(){
    return {
      id: expect.any(String),
      userId: expect.any(String),
      saleId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      user: expect.objectContaining({
        ...this.userModel()
      })
    }
  }


}


module.exports = ModelsExpected

