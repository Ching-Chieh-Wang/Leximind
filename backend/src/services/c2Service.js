const c2 = require('../config/c2')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Upload Profile Image and Return File Name (AWS SDK v2)
const uploadProfileImage = async (file) => {
  try {
    // Generate unique file name using timestamp and UUID
    const fileName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;

    // Read the file into a buffer (no aws-chunked issue)
    const fileBuffer = fs.readFileSync(file.path);

    // Set upload parameters
    const uploadParams = {
      Bucket: process.env.C2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };

    await c2.upload(uploadParams).promise();

    // Return the file name for future reference
    return fileName;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image');
  }
}


// Delete Image (using Read-Write Key)
const deleteImage = async (fileName) => {
  const params = {
    Bucket: process.env.C2_BUCKET_NAME,
    Key: fileName
  };

  try {
    await c2.deleteObject(params).promise();
    return { success: true, message: 'Image deleted successfully.' };
  } catch (error) {
    console.error('Image Deletion Error:', error);
    return { success: false, message: 'Failed to delete image.' };
  }
}

// Generate Long-Lived Signed URL (AWS SDK v2)
const generateSignedUrl = async (fileName) => {
  const params = {
    Bucket: process.env.C2_BUCKET_NAME,
    Key: fileName,
    Expires: 60 * 60 * 24 * 7  // 7 days in seconds
  };

  // Generate Signed URL using AWS SDK v2
  const signedUrl = c2.getSignedUrl('getObject', params);
  return signedUrl;
}

module.exports = {
  uploadProfileImage,
  generateSignedUrl,
  deleteImage
};