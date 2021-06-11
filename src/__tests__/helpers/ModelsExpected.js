

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

}


module.exports = ModelsExpected