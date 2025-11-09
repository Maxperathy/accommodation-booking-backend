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

const getPlaceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placeId } = req.params;

    const place = await Place.findById(placeId);

    if (!place) {
      res.status(404).json({
        success: false,
        message: 'Place not found',
      });
      return;
    }

    res.json({
      success: true,
      data: place,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to get place by Id', err);
  }
};

export default getPlaceById;
