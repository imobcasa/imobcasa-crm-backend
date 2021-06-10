const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')
const { XHubSignatureService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')

class XHubSignatureMiddleware {

  async checkSignature (req, res, next){
    try{
      const xHubSignatureService = new XHubSignatureService()
      await xHubSignatureService.checkSignature(req.headers, req.body)
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

module.exports = XHubSignatureMiddleware