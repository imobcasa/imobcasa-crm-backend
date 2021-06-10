function ServiceException(message, statusCode){
  this.message = message
  this.statusCode = statusCode
}

module.exports = ServiceException