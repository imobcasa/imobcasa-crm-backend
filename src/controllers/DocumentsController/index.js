const { Router } = require('express')
const { serverError } = require('../../helpers/Errors')
const { internalError } = require('../../helpers/Protocols')
const { DocumentService } = require('../../services')
const {
  AuthenticationMiddleware,
  FileUploadMiddleware
} = require('../../middlewares')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class DocumentsController {
  routes = Router()
  basePath = "/documents"
  updateStatusPath = "/documents/status"
  updateTypePath = "/documents/type"
  updateFilePath = "/documents/file"
  listStatusesPath = "/documents/status/list"
  listTypesPath = "/documents/types/list"
  getUrlPath = "/documents/file/url"

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.fileUploadMid = new FileUploadMiddleware()
    this._load()
  }


  async _load() {

    this.routes.post(
      this.basePath,
      (req, res, next) => {
        req.socket.setTimeout(4000)
        next()
      },
      this.fileUploadMid.catchFile().single("file"),
      this.authenticationMid.checkAuthentication,
      this.create)

    this.routes.put(
      this.updateFilePath,
      this.fileUploadMid.catchFile().single("file"),
      this.authenticationMid.checkAuthentication,
      this.changeFile)

    this.routes.get(this.basePath,
      this.authenticationMid.checkAuthentication,
      this.listByCustomer)

    this.routes.route(this.getUrlPath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.getUrl)

    this.routes.route(this.updateStatusPath)
      .all(this.authenticationMid.checkAuthentication)
      .put(this.changeStatus)

    this.routes.route(this.updateTypePath)
      .all(this.authenticationMid.checkAuthentication)
      .put(this.changeType)


    this.routes.route(this.listStatusesPath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.listDocumentStatuses)

    this.routes.route(this.listTypesPath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.listDocumentTypesCustomer)

    this.routes.delete(
      this.basePath,
      this.authenticationMid.checkAuthentication,
      this.deleteDocument)

  }

  async create(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.create({
        ...req.body,
        ...req.file
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

  async listByCustomer(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.listByCustomer(req.headers)
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

  async getUrl(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.getUrl(req.headers)
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

  async changeStatus(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.changeStatus(req.body)
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

  async changeType(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.changeType(req.body)
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

  async changeFile(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.changeFile({
        ...req.file,
        ...req.headers
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

  async listDocumentStatuses(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.listDocumentStatus()
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

  async listDocumentTypesCustomer(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.listDocumentTypesCustomer(req.headers)
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

  async deleteDocument(req, res) {
    try {
      const documentService = new DocumentService()
      const data = await documentService.deleteDocument(req.headers)
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

module.exports = DocumentsController
