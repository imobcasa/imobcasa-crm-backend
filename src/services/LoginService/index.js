const Service = require('../Service')
const {Users} = require('../../models')
const {UserRepository} = require ('../../repositories')
const jwt = require('jsonwebtoken')
const JwtImplementation = require('../../implementations/jwt')

class LoginService extends Service {

  _authenticateRequiredFields = ["username", "password"]
  _checkAuthenticationRequiredFields = ["authorization"]
  _refreshTokenRequiredFields = ["refreshToken"]

  constructor() {
    super()
    this._userRepository = new UserRepository()
    this._jwtImplementation = new JwtImplementation()
  }


  async _checkUserEntityExsits(entity) {
    if (!entity) {
      this._throwUnalthorizedError("Username or Password")
    }
  }

  async _checkPassword(user, password) {
    if (!await user.validPassword(password)) {
      this._throwUnalthorizedError("Username or Password")
    }
  }

  async authenticate(fields) {
    await this._checkRequiredFields(this._authenticateRequiredFields, fields)
    const user = await Users.findOne({
      where: {
        username: fields.username
      },
      include: [
        {
          association: "profile",
          attributes: ["name", "admin", "teamManager"]
        }],
    })

    await this._checkUserEntityExsits(user, "Username or Password")
    await this._checkPassword(user, fields.password)

    

    const accessToken = await this._jwtImplementation.generateAccessToken(user.id, user.profile)
    const refreshToken = await this._jwtImplementation.generateRefreshToken(user.id, user.profile)
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      profile: {
        name: user.profile.name,
        admin: user.profile.admin,
        teamManager: user.profile.teamManager,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  async checkAuthentication(fields) {    
    await this._checkRequiredFields(this._checkAuthenticationRequiredFields, fields)
    const jwt = fields.authorization.split(" ")[1]
    await this._checkEntityExsits(jwt, "token")
    return await this._checkToken(jwt)
  }

  async refreshToken(fields){
    await this._checkRequiredFields(this._refreshTokenRequiredFields, fields)
    const { refreshToken } = fields
    const refreshTokenDecoded = await this._checkToken(refreshToken)
    const user = await this._userRepository.getOne({id: refreshTokenDecoded.id})
    const accessToken =  await this._jwtImplementation.generateAccessToken(user.id, user.admin)

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      admin: user.admin,
      username: user.username,
      active: user.active,
      tokens: {
        accessToken,
        refreshToken
      }
    }

  }
}

module.exports = LoginService