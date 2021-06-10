const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')
const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
const { LoginService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')

class AuthenticationMiddleware {

  async checkAuthentication (req,res,next) {
    try{    
      const loginService = new LoginService()
      const tokenDecoded = await loginService.checkAuthentication(req.headers)
      req.locals = {
        reqUserId: tokenDecoded.id,
        admin: tokenDecoded.admin
      }
      next()
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

module.exports = AuthenticationMiddleware