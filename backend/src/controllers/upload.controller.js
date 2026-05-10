const cloudinary = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../helpers/response.helper');

class UploadController {
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return sendError(res, 'No file uploaded', [], 400);
      }

      // Convert buffer to base64
      const fileStr = req.file.buffer.toString('base64');
      const fileType = req.file.mimetype;
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${fileType};base64,${fileStr}`,
        { folder: 'traveloop' }
      );

      sendSuccess(res, 'Image uploaded successfully', {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id
      });
    } catch (error) {
      console.error('Upload Error:', error);
      sendError(res, 'Failed to upload image', error.message);
    }
  }
}

module.exports = new UploadController();
