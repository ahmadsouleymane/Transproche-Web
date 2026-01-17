import mongoose, { Schema } from 'mongoose';
import { ICompany } from '../types';

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la compagnie est requis'],
      trim: true,
      unique: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
      trim: true,
    },
    commission: {
      type: Number,
      default: 10,
      min: [0, 'La commission ne peut pas être négative'],
      max: [100, 'La commission ne peut pas dépasser 100%'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
companySchema.index({ name: 1 });
companySchema.index({ status: 1 });

export const Company = mongoose.model<ICompany>('Company', companySchema);
