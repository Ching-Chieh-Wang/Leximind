// Upload Profile Image Directly from URL (AWS SDK v2)
const c2 = require('../config/c2')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch'); // Only needed if using Node.js < 18

const uploadProfileImage = async (imageUrl) => {
  try {
    // Step 1: Download the image using fetch()
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Step 2: Generate a unique file name using timestamp and UUID
    const contentType = response.headers.get('content-type'); 
    const fileName = `C2${Date.now()}-${uuidv4()}${path.extname(imageUrl.split('?')[0])}`;

    // Step 3: Set upload parameters
    const uploadParams = {
      Bucket: process.env.C2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    // Step 4: Upload the image to S3 (C2)
    await c2.upload(uploadParams).promise();

    // Step 5: Return the file name for future reference
    return fileName;
  } catch (error) {
    throw new Error('Failed to upload profile image',error);
  }
};


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