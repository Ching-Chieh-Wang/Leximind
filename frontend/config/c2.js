import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
require('dotenv').config();


// Initialize C2 Client for Signed URLs (AWS SDK v3)
const c2 = new S3Client({
  credentials: {
    accessKeyId: process.env.C2_READONLY_ACCESS_KEY,
    secretAccessKey: process.env.C2_READONLY_SECRET_KEY,
  },
  region: process.env.C2_REGION,
  endpoint: process.env.C2_ENDPOINT,
  forcePathStyle: true  // Required for S3-compatible storage like Synology C2
});

const generateSignedUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.C2_BUCKET_NAME,
    Key: fileName
  });

  // Generate Signed URL (Expires in 7 days)
  const signedUrl = await getSignedUrl(c2, command, { expiresIn: 60 * 60 * 24 * 7 });
  return signedUrl;
};

export default generateSignedUrl;