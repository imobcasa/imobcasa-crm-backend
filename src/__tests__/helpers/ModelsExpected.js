

class ModelsExpected {

  userModel() {
    return {
      active: expect.any(Boolean),
      createdAt: expect.any(Date),
      email: expect.any(String),
      fullName: expect.any(String),
      id: expect.any(String),
      admin: expect.any(Boolean),
      updatedAt: expect.any(Date),
      username: expect.any(String),
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