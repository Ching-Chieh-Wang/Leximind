const c2 = require('../config/c2')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

// Upload Profile Image Directly from URL (AWS SDK v2)
const uploadProfileImage = async (imageUrl) => {
  try {
    // Generate a unique file name using timestamp and UUID
    const fileName = `${Date.now()}-${uuidv4()}${path.extname(imageUrl.split('?')[0])}`;

    // Set upload parameters for copying directly from URL
    const uploadParams = {
      Bucket: process.env.C2_BUCKET_NAME,
      Key: fileName,
      CopySource: imageUrl,  // Directly copy from URL
      MetadataDirective: 'REPLACE',  // Ensures metadata is replaced with new data
    };

    console.log('bucket',process.env.C2_BUCKET_NAME)

    await c2.copyObject(uploadParams).promise();

    // Return the file name for future reference
    return fileName;
  } catch (error) {
    console.error('Error copying profile image from URL:', error);
    throw new Error('Failed to upload profile image');
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