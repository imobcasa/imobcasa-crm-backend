const { Router } = require('express')
const { serverError } = require('../../helpers/Errors')
const { internalError } = require('../../helpers/Protocols')
const { SalesService } = require('../../services')
const {
  AuthenticationMiddleware,
} = require('../../middlewares')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class SalesController {
  routes = Router()
  basePath = "/sales"
  usersAvailablePath = "/sales/users"

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this._load()
  }


  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.getSale)
      .post(this.createSale)
      .put(this.updateSale)
      .delete(this.deleteSale)
    
    this.routes.route(this.usersAvailablePath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.getUsersAvailable)
  }

  async getSale(req, res) {
    try {
      const salesService = new SalesService()
      const data = await salesService.getSale({
        ...req.headers,
        ...req.locals
      })
      return res.status(200).json(data)
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

  async createSale(req, res){
    try {
      const salesService = new SalesService()
      const data = await salesService.create(req.body)
      return res.status(200).json(data)
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

  async updateSale(req, res){
    try {
      const salesService = new SalesService()
      const data = await salesService.update(req.body)
      return res.status(200).json(data)
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

  async deleteSale(req, res){
    try {
      const salesService = new SalesService()
      const data = await salesService.delete(req.headers)
      return res.status(200).json(data)
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
  async getUsersAvailable(req, res){
    try {
      const salesService = new SalesService()
      const data = await salesService.getUsersAvailable()
      return res.status(200).json(data)
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

module.exports = SalesController