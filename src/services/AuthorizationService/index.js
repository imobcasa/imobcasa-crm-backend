const Service = require('../Service')
const {Users} = require('../../models/')
const jwt = require('jsonwebtoken')

class AuthorizationService extends Service {

  _adminRequiredFields = ["authorization"]


  async _checkUserAdminPrivileges(id){
    const user = await Users.findOne({ where: { id: id }, include: ['profile'] })
    if (!user.profile.admin) {
      this._throwForbidenError("authorization")      
    }
  }

  async checkUserAuthorization(fields) {
    await this._checkRequiredFields(this._adminRequiredFields, fields)   
    const jwt = fields.authorization.split(" ")[1]
    const userDecoded = await this._checkToken(jwt)
    await this._checkUserAdminPrivileges(userDecoded.id)
    return userDecoded
  }
}

module.exports = AuthorizationService