/**
 * Node modules
 */

import { z } from 'zod';

// Create booking schema
export const createBookingSchema = z
  .object({
    place: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid place ID' }),
    checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid check-in date',
    }),
    checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid check-out date',
    }),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    phone: z
      .string()
      .regex(/^[\d\s\-+()]+$/, { message: 'Invalid phone number format' })
      .min(10, 'Phone number is too short')
      .max(20, 'Phone number is too long'),
    price: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .positive('Price must be positive')
          .max(1000000, 'Price is too high'),
      ),
    guests: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .positive('Number of guests must be positive')
          .max(50, 'Maximum 50 guests allowed'),
      ),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      return checkOut > checkIn;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOut'],
    },
  );

// Booking ID param validation
export const bookingIdSchema = z.object({
  bookingId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid Booking Id' }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingIdParam = z.infer<typeof bookingIdSchema>;
