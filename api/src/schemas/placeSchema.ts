/**
 * Node modules
 */
import { z } from 'zod';

// Place schema validation for multipart/form-data
export const createPlaceSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(100, 'Description is too long'),
  perks: z
    .string()
    .transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        return [];
      }
    })
    .pipe(z.array(z.string()).max(15, 'Maximum 15 perks allowed')),
  extraInfo: z
    .string()
    .max(50, 'Extra info is too long')
    .optional()
    .or(z.literal('')), // Handle empty strings
  checkIn: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(0, 'Check-in must be between 0-23')
        .max(23, 'Check-in must be between 0-23'),
    ),
  checkOut: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(0, 'Check-out must be between 0-23')
        .max(23, 'Check-out must be between 0-23'),
    ),
  maxGuests: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .positive('Maximum guests must be positive')
        .max(50, 'Maximum 50 guests allowed'),
    ),
  price: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .positive('Price must be positive')
        .max(1000000, 'Price is too high'),
    ),
});

//User ID param validation
export const placeIdSchema = z.object({
  placeId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid Place Id' }),
});

//Query parameters validation
export const getPlacesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, 'Limit must be between 1 to 50')
        .max(50, 'Limit must be between 1 to 50'),
    ),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 0))
    .pipe(z.number().int().min(0, 'Offset must be a positive number')),
});

//Update place schema - all fields optional

export const updatePlaceSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title is too long')
      .optional(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address is too long')
      .optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(100, 'Description is too long')
      .optional(),
    perks: z
      .string()
      .transform((str) => {
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      })
      .pipe(z.array(z.string()).max(15, 'Maximum 15 perks allowed'))
      .optional(),
    extraInfo: z.string().max(50, 'Extra info is too long').optional(),
    checkIn: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .min(0, 'Check-in must be between 0-23')
          .max(23, 'Check-in must be between 0-23'),
      )
      .optional(),
    checkOut: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .min(0, 'Check-out must be between 0-23')
          .max(23, 'Check-out must be between 0-23'),
      )
      .optional(),
    maxGuests: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .positive('Maximum guests must be positive')
          .max(50, 'Maximum 50 guests allowed'),
      )
      .optional(),
    price: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number()
          .positive('Price must be positive')
          .max(1000000, 'Price is too high'),
      )
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

//Type Inference
export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UserIdparam = z.infer<typeof placeIdSchema>;
export type GetPlacesQuery = z.infer<typeof getPlacesQuerySchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;
