import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image buffer to Cloudinary
export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image' as const,
      folder: options.folder || 'codesync/avatars',
      public_id: options.public_id,
      // Simplified transformation for testing
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ],
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }
    ).end(buffer);
  });
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};