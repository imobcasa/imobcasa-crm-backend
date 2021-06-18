const { Router } = require('express')
const { ProfileService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const {
  AuthenticationMiddleware,
  AuthorizationMiddleware
} = require('../../middlewares')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')

class ProfilesController {
  routes = Router()
  basePath = "/profiles"
  
  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.authorizationMid = new AuthorizationMiddleware()
    this._load()
  }


  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this.listAll)

  }

  
  async listAll(req, res){
    try {
      const profileService = new ProfileService()
      const user = await profileService.listAll()
      return res.status(200).json(user)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }

}


module.exports = ProfilesController