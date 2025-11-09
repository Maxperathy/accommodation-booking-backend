// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

// Multiple files upload (NEW - for your Place photos)
export const uploadMultipleToCloudinary = (
  buffers: Buffer<ArrayBufferLike>[],
): Promise<string[]> => {
  const uploadPromises = buffers.map((buffer) => {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            allowed_formats: ['png', 'jpg', 'webp'],
            resource_type: 'image',
            folder: 'accom-book',
            transformation: { quality: 'auto' },
          },
          (err, result) => {
            if (err) {
              console.error('Error uploading image to Cloudinary');
              reject(err);
            } else if (result) {
              resolve(result.secure_url); // Return the URL
            } else {
              reject(new Error('Upload failed'));
            }
          },
        )
        .end(buffer);
    });
  });

  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
};

export default cloudinary;
