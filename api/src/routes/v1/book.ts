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
  validateQuery,
  validateParams,
} from '@/middleware/validation';
import { createBookingSchema, bookingIdSchema } from '@/schemas/bookingSchema';

/**
 * Controllers
 */
import createBooking from '@/controllers/v1/booking/create_booking';

import getUserBookings from '@/controllers/v1/booking/get_user_bookings';
import getBookingById from '@/controllers/v1/booking/get_booking_by_id';
import { getPlacesQuerySchema } from '@/schemas/placeSchema';

const router = Router();

router.post(
  '/bookings',
  authenticate,
  validateBody(createBookingSchema),
  createBooking,
);

// Specific route must come before general route
router.get(
  '/bookings/:bookingId',
  authenticate,
  validateParams(bookingIdSchema),
  getBookingById,
);

router.get(
  '/bookings',
  authenticate,
  validateQuery(getPlacesQuerySchema),
  getUserBookings,
);

export default router;
