const AWS = require('aws-sdk');

// Initialize C2 Client for AWS SDK v2
const c2 = new AWS.S3({
  accessKeyId: process.env.C2_ACCESS_KEY,
  secretAccessKey: process.env.C2_SECRET_KEY,
  region: process.env.C2_REGION,
  endpoint: process.env.C2_ENDPOINT,
  signatureVersion: 'v4'
});

module.exports = c2