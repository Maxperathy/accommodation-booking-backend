/**
 * Node modules
 */
import { Schema, model, Document, Types } from 'mongoose';

import { CreateBookingInput } from '@/schemas/bookingSchema';

export interface IBooking
  extends Omit<
      CreateBookingInput,
      'place' | 'checkIn' | 'checkOut' | 'price' | 'guests'
    >,
    Document {
  place: Types.ObjectId;
  user: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  price: number;
  guests: number;
  createdAt: Date;
  updatedAt: Date;
}
const bookingSchema = new Schema<IBooking>(
  {
    place: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Place',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//Compound index for faster overalap queries
bookingSchema.index({ place: 1, checkIn: 1, checkout: 1 });

//Index for user bookings
bookingSchema.index({ user: 1, checkIn: -1 });

export default model<IBooking>('Booking', bookingSchema);
