const { Router } = require('express')
const { serverError } = require('../../helpers/Errors')
const { internalError } = require('../../helpers/Protocols')
const { LoginService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class AuthenticationController {
  routes = Router()
  basePath = "/login"
  refreshTokenPath = `${this.basePath}/refresh`

  constructor() {
    this._load()
  }


  async _load() {
    this.routes.post(this.basePath, this.authenticate)
    this.routes.post(this.refreshTokenPath, this.refreshToken)
  }

  async authenticate(req, res){
    try{
      const loginService = new LoginService()
      const token = await loginService.authenticate(req.body)
      return res.status(200).json(token)
    }catch(err){
      if(err instanceof ServiceException){
        const {statusCode, message} = err
        return res.status(statusCode).json(message)
      }else {
        console.error(err)
        const {error} = serverError()
        const {statusCode, body} = internalError(error)
        return res.status(statusCode).send(body)
      }      
    }
  }
  async refreshToken(req, res){
    try{
      const loginService = new LoginService()
      const tokens = await loginService.refreshToken(req.body)
      return res.status(200).json(tokens)
    }catch(err){
      if(err instanceof ServiceException){
        const {statusCode, message} = err
        return res.status(statusCode).json(message)
      }else {
        console.error(err)
        const {error} = serverError()
        const {statusCode, body} = internalError(error)
        return res.status(statusCode).send(body)
      }      
    }
  }
}

module.exports = AuthenticationController