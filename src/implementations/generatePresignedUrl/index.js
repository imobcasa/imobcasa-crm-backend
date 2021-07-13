const aws = require('aws-sdk')



var credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
aws.config.update({
	credentials: credentials,
	region: process.env.AWS_DEFAULT_REGION
})


const generatePreSignedUrl = async (key) => {
  const S3 = new aws.S3({
    signatureVersion: "v4"
  })
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    Expires: 3600
  }
  return await S3.getSignedUrlPromise("getObject", params)
}



module.exports = generatePreSignedUrl