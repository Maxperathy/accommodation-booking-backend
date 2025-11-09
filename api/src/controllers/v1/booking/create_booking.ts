/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Booking from '@/models/book';
import Place from '@/models/place';
import { CreateBookingInput } from '@/schemas/bookingSchema';

/**
 * Types
 */
import type { Request, Response } from 'express';

const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { checkIn, checkOut, name, phone, place, price, guests } =
      req.body as CreateBookingInput;

    const userId = req.userId;

    //Check if place exists
    const placeExists = await Place.findById(place);
    if (!placeExists) {
      res.status(404).json({
        success: false,
        message: 'Place Not Found',
      });
      return;
    }

    //User cannot book their own place
    if (placeExists?.owner.toString() === userId?.toString()) {
      res.status(400).json({
        success: false,
        message: 'You cannot book your own place',
      });
      return;
    }

    //Check validity of dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past',
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
      return;
    }

    //No overlapping bookings for this place
    const overlappingBooking = await Booking.findOne({
      place: place,
      $or: [
        // New booking starts during existing booking
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate },
        },
        // New booking ends during existing booking
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate },
        },
        // New booking encompasses existing booking
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate },
        },
      ],
    });

    if (overlappingBooking) {
      res.status(409).json({
        success: false,
        message: 'This place is already booked for the selected dates',
        conflictingBooking: {
          checkIn: overlappingBooking.checkIn,
          checkOut: overlappingBooking.checkOut,
        },
      });
      return;
    }

    //User doesn't already have a booking for this place on these dates
    const existingUserBooking = await Booking.findOne({
      place: place,
      user: userId,
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate },
        },
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate },
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate },
        },
      ],
    });

    if (existingUserBooking) {
      res.status(409).json({
        success: false,
        message: 'You already have a booking for this place on these dates',
        existingBooking: {
          checkIn: existingUserBooking.checkIn,
          checkOut: existingUserBooking.checkOut,
        },
      });
      return;
    }

    //CHECK: Number of guests doesn't exceed place capacity
    if (guests > placeExists.maxGuests) {
      res.status(400).json({
        success: false,
        message: `Maximum ${placeExists.maxGuests} guests allowed for this place`,
      });
      return;
    }
    const newBooking = await Booking.create({
      place,
      user: userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      name,
      phone,
      price,
      guests,
    });

    logger.info('Booking created in database', {
      bookingId: newBooking._id,
      userId,
      placeId: place,
    });

    await newBooking.populate('place user', '-password -__v');

    res.status(201).json({
      success: true,
      message: 'Booking created successfuly',
      data: newBooking,
    });
    logger.info('Booking created successfully', {
      bookingId: newBooking._id,
      userId,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to create booking', err);
  }
};

export default createBooking;
