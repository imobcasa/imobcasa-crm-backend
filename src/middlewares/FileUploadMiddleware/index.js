const multer = require("multer");
const multerConfig = require("../../implementations/fileUpload");



class FileUploadMiddleware {


  catchFile(){   
    return multer(multerConfig)
  }

}

module.exports = FileUploadMiddleware