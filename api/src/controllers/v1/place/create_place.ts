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

const createPlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { perks, checkIn, checkOut, maxGuests, price, ...restData } =
      req.body;

    const newPlace = await Place.create({
      ...restData,
      owner: req.userId,
      photos: req.uploadedPhotos,
      perks: typeof perks === 'string' ? JSON.parse(perks) : perks,
      checkIn: Number(checkIn),
      checkOut: Number(checkOut),
      maxGuests: Number(maxGuests),
      price: Number(price),
    });

    res.status(201).json({
      success: true,
      message: 'Place created successfully',
      data: newPlace,
    });
    logger.info(`Place created with ID: ${newPlace._id}`);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while creating a place', err);
  }
};

export default createPlace;
