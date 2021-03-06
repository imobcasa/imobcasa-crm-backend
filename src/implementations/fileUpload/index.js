const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");



var credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
aws.config.update({
	credentials: credentials,
	region: process.env.AWS_DEFAULT_REGION
})


const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, file.key);
      });
    },    
  }),
  s3: multerS3({
    s3: new aws.S3({
      signatureVersion: "v4"
    }),
    bucket: process.env.BUCKET_NAME,    
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;        
        cb(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"),
  storage: process.env.NODE_ENV === "test" ? "local" : storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/jpg",
      "application/pdf"
    ];


    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
};