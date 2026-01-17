import mongoose, { Schema } from 'mongoose';
import { IAdvertisement } from '../types';

const advertisementSchema = new Schema<IAdvertisement>(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    },
    image: {
      type: String,
      required: [true, 'L\'image est requise'],
    },
    link: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
advertisementSchema.index({ active: 1 });
advertisementSchema.index({ position: 1 });

export const Advertisement = mongoose.model<IAdvertisement>('Advertisement', advertisementSchema);
