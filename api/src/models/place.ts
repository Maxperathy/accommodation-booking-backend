/**
 * Node modules
 */
import { Schema, model, Document, Types } from 'mongoose';

import { CreatePlaceInput } from '@/schemas/placeSchema';

export interface IPlace extends Omit<CreatePlaceInput, 'owner'>, Document {
  owner: Types.ObjectId;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}
const placeSchema = new Schema<IPlace>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    perks: {
      type: [String],
      default: [],
    },
    extraInfo: {
      type: String,
    },
    checkIn: {
      type: Number,
      required: true,
    },
    checkOut: {
      type: Number,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IPlace>('Place', placeSchema);
