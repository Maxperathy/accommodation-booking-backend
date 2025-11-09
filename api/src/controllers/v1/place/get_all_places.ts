/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Place from '@/models/place';

/**
 * Types
 */
import type { Request, Response } from 'express';
import config from '@/config';

const getAllPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const total = await Place.countDocuments();

    const places = await Place.find()
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
        places,
      },
    });

    logger.info('Fetched public places successfully', {
      limit,
      count: places.length,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to fetch public places', err);
  }
};

export default getAllPlaces;
