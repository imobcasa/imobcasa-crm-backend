const { Router } = require('express')
const { serverError } = require('../../helpers/Errors')
const { internalError } = require('../../helpers/Protocols')
const { LoginService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class GenericController {
  routes = Router()
  basePath = "/"

  constructor() {
    this._load()
  }


  async _load() {
    this.routes.get(this.basePath, this.generic)
    this.routes.post(this.basePath, this.generic)
    this.routes.delete(this.basePath, this.generic)
    this.routes.put(this.basePath, this.generic)
  }

  async generic(req, res){
    try{
      return res.status(404).json()
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

module.exports = GenericController