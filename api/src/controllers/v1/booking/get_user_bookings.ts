/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */
import Booking from '@/models/book';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const total = await Booking.countDocuments({ user: userId });

    const bookings = await Booking.find({ user: userId })
      .populate('place')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      data: {
        limit,
        offset,
        total,
        bookings,
      },
    });

    logger.info('User bookings fetched successfully', {
      userId,
      count: bookings.length,
      total,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to fetched bookings', err);
  }
};

export default getUserBookings;
