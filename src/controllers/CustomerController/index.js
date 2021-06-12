const { Router } = require('express')
const { serverError } = require('../../helpers/Errors')
const { internalError } = require('../../helpers/Protocols')
const {
  AuthenticationMiddleware,
} = require('../../middlewares')
const { CustomerService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class CustomerController {
  routes = Router()
  basePath = "/customers"

  constructor() {    
    
    this.authenticationMid = new AuthenticationMiddleware()
    this._load()
  }


  async _load() {

    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this._list)

  }

  async _list(req, res){
    try{
      const customerService = new CustomerService()
      const data = await customerService.list({
        'x-status': req.headers['x-status'],
        ...req.locals
      })
      return res.status(200).json(data)
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

module.exports = CustomerController