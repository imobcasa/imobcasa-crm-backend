const { Router } = require('express')
const { UserService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const {
  AuthenticationMiddleware,
  AuthorizationMiddleware
} = require('../../middlewares')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')

class UserController {
  routes = Router()
  basePath = "/users"
  getOnePath = `${this.basePath}/:id`
  searchPath = `${this.basePath}/search`
  changePwdPath = '/me/password'
  resetPwdPath = `${this.getOnePath}/password/reset`

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.authorizationMid = new AuthorizationMiddleware()
    this._load()
  }


  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this._list)
      .post(this._create)
      .put(this._update)
      .delete(this._delete)

    this.routes.route(this.getOnePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this._getOne)

    this.routes.route(this.searchPath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this._search)

    this.routes.route(this.changePwdPath)
      .all(this.authenticationMid.checkAuthentication)
      .put(this.changePassword)

    this.routes.route(this.resetPwdPath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .put(this.resetPassword)
  }

  async _getOne(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.getUser(req.params)
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

  async _create(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.createUser(req.body)
      delete user.password
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

  async _list(req, res) {
    try {
      const userService = new UserService()
      const users = await userService.findAll()
      return res.status(200).json(users)
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

  async _update(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.updateUser(req.body)

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

  async _delete(req, res) {
    try {
      const userService = new UserService()
      const result = await userService.deleteUser(req.params)
      res.status(200).json(result)
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

  async _search(req, res) {
    try {
      console.log("teste")
    } catch (error) {

    }
  }

  async changePassword(req, res) {
    try {
      const userService = new UserService()
      const result = await userService.changePassword({
        ...req.body,
        ...req.locals
      })
      return res.status(204).json()
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

  async resetPassword(req, res) {
    try {
      const userService = new UserService()
      console.log(req.params)
      const result = await userService.resetPassword({
        ...req.params,
        ...req.body
      })
      return res.status(204).json()
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


module.exports = UserController