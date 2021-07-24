const { DocumentService } = require('../../services')
const Service = require('../../services/Service')
const { DocumentsRepository } = require('../../repositories')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


describe('DocumentService tests', () => {  

  describe('addComment tests', () => {

    it('Should call _throwMissingParamError if no x-document-id has been provided', () => {
      const thowMissingParamErrorMock = jest.spyOn(Service.prototype, '_throwMissingParamError')
      
      const fields = {
        comments: 'Comentários do doc',
      }
      const documentService = new DocumentService()
      documentService.addComment(fields)
      expect(thowMissingParamErrorMock).toHaveBeenCalledWith('x-document-id')
    })

    it('Should call _throwMissingParamError if no comments has been provided', async () => {
      const thowMissingParamErrorMock = jest.spyOn(Service.prototype, '_throwMissingParamError')

      const fields = {
        'x-document-id': 1234
      }
      const documentService = new DocumentService()
      await documentService.addComment(fields)
      expect(thowMissingParamErrorMock).toHaveBeenCalledWith('comments')
    })


    it('Should call _throwInvalidParamError with x-document-id if invalid x-document-id has been provided', async () => {
      const getOneMock = jest.spyOn(DocumentsRepository.prototype, 'getOne')
      getOneMock.mockReturnValue(null)

      const throwInvalidParamErrorMock = jest.spyOn(Service.prototype, '_throwInvalidParamError')
      
      const fields = {
        'x-document-id': 1234,
        comments: 'Comentários do doc'
      }
      const documentService = new DocumentService()
      await documentService.addComment(fields)
      expect(throwInvalidParamErrorMock).toHaveBeenCalledWith('x-document-id')
    })


    it('Should return true if document comments has been added', async () => {
      const getOneMock = jest.spyOn(DocumentsRepository.prototype, 'getOne')
      getOneMock.mockResolvedValue({ id: 123 })

      const updateCommentMock = jest.spyOn(DocumentsRepository.prototype, 'updateComment')
      updateCommentMock.mockResolvedValue(1)

      const fields = {
        'x-document-id': 1234,
        comments: 'Comentários do doc'
      }
      const documentService = new DocumentService()
      const result = await documentService.addComment(fields)
      expect(result).toBe(true)
    })
  })
})