/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middleware
 */
import authenticate from '@/middleware/authenticate';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '@/middleware/validation';
import { uploadMultiplePhotos } from '@/middleware/uploadImages';
import { handleMulterError } from '@/middleware/uploadImages';
import { processPhotosUpload } from '@/middleware/uploadImages';

/**
 * Controllers
 */
import createPlace from '@/controllers/v1/place/create_place';
import getUserPlaces from '@/controllers/v1/place/get_places_by_users';

import {
  createPlaceSchema,
  getPlacesQuerySchema,
  placeIdSchema,
  updatePlaceSchema,
} from '@/schemas/placeSchema';
import getPlaceById from '@/controllers/v1/place/get_place_by_id';
import updatePlace from '@/controllers/v1/place/update_place';
import getAllPlaces from '@/controllers/v1/place/get_all_places';

const router = Router();

router.post(
  '/create-place',
  authenticate, // 1. Auth
  uploadMultiplePhotos, // 2. Multer (parse files)
  handleMulterError, // 3. Handle errors
  processPhotosUpload, // 4. Upload to Cloudinary
  validateBody(createPlaceSchema), // 5. Validate body
  createPlace, // 5. Save to DB
);

router.get(
  '/places',
  authenticate,
  validateQuery(getPlacesQuerySchema),
  getUserPlaces,
);

router.get('/all', validateQuery(getPlacesQuerySchema), getAllPlaces);

router.get('/:placeId', validateParams(placeIdSchema), getPlaceById);

router.put(
  '/:placeId',
  authenticate,
  uploadMultiplePhotos,
  handleMulterError,
  processPhotosUpload,
  validateParams(placeIdSchema),
  validateBody(updatePlaceSchema),
  updatePlace,
);

export default router;
