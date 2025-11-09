/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Booking from '@/models/book';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    logger.info('Fetching booking by ID', { bookingId, userId });

    const booking = await Booking.findById(bookingId)
      .populate('place')
      .lean()
      .exec();

    if (!booking) {
      logger.warn('Booking not found', { bookingId });
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Verify that the booking belongs to the current user
    // With .lean(), ObjectIds are converted to strings, but handle all cases
    const bookingUserIdStr = String(booking.user);
    const currentUserIdStr = String(userId);

    logger.info('Comparing user IDs', {
      bookingUserId: bookingUserIdStr,
      currentUserId: currentUserIdStr,
      bookingUserRaw: booking.user,
      bookingUserType: typeof booking.user,
      match: bookingUserIdStr === currentUserIdStr,
    });

    if (bookingUserIdStr !== currentUserIdStr) {
      logger.warn('Unauthorized booking access attempt', {
        bookingId,
        bookingUserId: bookingUserIdStr,
        currentUserId: currentUserIdStr,
      });
      res.status(403).json({
        success: false,
        message: 'Unauthorized to view this booking',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });

    logger.info('Booking fetched successfully', {
      bookingId,
      userId,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to get booking by Id', err);
  }
};

export default getBookingById;

