/**
 * Node modules
 */
import multer from 'multer';

/**
 * Custom modules
 */
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import { logger } from '@/lib/winston';

/**
 * Types
 */
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Handle multiple file uploads
export const uploadMultiplePhotos = upload.array('photos', 10);

// Upload to Cloudinary middleware
export const processPhotosUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded',
      });
    }

    const files = req.files as Express.Multer.File[];

    // Extract buffers from files
    const buffers = files.map((file) => file.buffer);

    // Upload all photos to Cloudinary
    const photoUrls = await uploadMultipleToCloudinary(buffers);

    // Attach URLs to request
    req.uploadedPhotos = photoUrls;

    next();
  } catch (error: any) {
    logger.error('Photo upload error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to upload photos',
      error: error.message,
    });
  }
};

// Error handler
export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum 5MB per file',
      });
    }
    logger.error('File too large. Maximum 5MB per file', err);

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 photos',
      });
    }
    logger.error('Too many files. Maximum 10 photos', err);
  }

  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};
