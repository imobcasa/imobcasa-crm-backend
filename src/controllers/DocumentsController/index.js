const { Router } = require('express')
const { serverError } = require('../../helpers/Errors')
const { internalError } = require('../../helpers/Protocols')
const { DocumentService } = require('../../services')
const {
  AuthenticationMiddleware,
  FileUploadMiddleware
} = require('../../middlewares')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const multer = require("multer");
const multerConfig = require("../../implementations/fileUpload");




class DocumentsController {
  routes = Router()
  basePath = "/documents"

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.fileUploadMid = new FileUploadMiddleware()
    this._load()
  }


  async _load() {

    this.routes.post(
      this.basePath, 
      multer(multerConfig).single("file"), 
      // this.authenticationMid.checkAuthentication,
      this.create)
      
  }

  async create(req, res){
    try{
      console.log(req.file)

      const documentService = new DocumentService()
      const data = documentService.create()
      return res.status(200).json()
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

module.exports = DocumentsController