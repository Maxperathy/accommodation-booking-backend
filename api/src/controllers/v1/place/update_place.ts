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
import { success } from 'zod';

const updatePlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placeId } = req.params;
    const currentUserId = req.userId?.toString();

    const place = await Place.findById(placeId);

    if (!place) {
      res.status(404).json({
        success: false,
        message: 'Place not found',
      });
      return;
    }

    if (place.owner.toString() !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized to update this place',
      });
      return;
    }

    const { perks, checkIn, checkOut, maxGuests, price, ...restData } =
      req.body;

    const updateData: any = { ...restData };

    if (perks) {
      updateData.perks = typeof perks === 'string' ? JSON.parse(perks) : perks;
    }
    if (checkIn) updateData.checkIn = Number(checkIn);
    if (checkOut) updateData.checkOut = Number(checkOut);
    if (maxGuests) updateData.maxGuests = Number(maxGuests);
    if (price) updateData.price = Number(price);

    if (req.uploadedPhotos && req.uploadedPhotos.length > 0) {
      const totalPhotos = place.photos.length + req.uploadedPhotos.length;

      if (totalPhotos > 10) {
        res.status(400).json({
          success: false,
          message: `Maximum 10 photos allowed. You have ${place.photos.length} photos and tried to add ${req.uploadedPhotos.length} more.`,
        });
        return;
      }

      updateData.photos = [...place.photos, ...req.uploadedPhotos];
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: 'Place updated successfully',
      data: updatedPlace,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to update place', err);
  }
};

export default updatePlace;
