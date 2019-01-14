const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('../config');

AWS.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-east-1'
});

const s3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
  if(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed'), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'api-demo-ben',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: 'TESTING_METADATA'})
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;