import mongoose, { Schema } from 'mongoose';
import { IParcel } from '../types';
import { generateTrackingNumber } from '../utils/reservationNumber.utils';

const personInfoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
      trim: true,
    },
  },
  { _id: false }
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingNumber: {
      type: String,
      unique: true,
    },
    parcelMode: {
      type: String,
      enum: ['envoi', 'recuperation'],
      required: [true, 'Le mode de colis est requis'],
      default: 'envoi',
    },
    sender: {
      type: personInfoSchema,
      required: [true, 'Les informations de l\'expéditeur sont requises'],
    },
    receiver: {
      type: personInfoSchema,
      required: [true, 'Les informations du destinataire sont requises'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est requis'],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'La compagnie est requise'],
    },
    type: {
      type: String,
      enum: ['petit', 'moyen', 'gros'],
      required: [true, 'Le type de colis est requis'],
    },
    description: {
      type: String,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    paymentMethod: {
      type: String,
      enum: ['livraison'],
      default: 'livraison',
    },
    status: {
      type: String,
      enum: ['en_attente', 'collecte', 'en_transit', 'livre', 'annule'],
      default: 'en_attente',
    },
    departure: {
      type: String,
      required: [true, 'La ville de départ est requise'],
      trim: true,
    },
    arrival: {
      type: String,
      required: [true, 'La ville d\'arrivée est requise'],
      trim: true,
    },
    // For 'recuperation' mode - pickup from a company
    receiptPhoto: {
      type: String,
    },
    idPhoto: {
      type: String,
    },
    pickupCompany: {
      type: String,
      trim: true,
    },
    // For 'envoi' mode - where recipient will pick up
    pickupLocation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate tracking number before saving
parcelSchema.pre('save', function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = generateTrackingNumber();
  }
  next();
});

// Index for faster queries (trackingNumber already indexed via unique: true)
parcelSchema.index({ user: 1 });
parcelSchema.index({ company: 1 });
parcelSchema.index({ status: 1 });

export const Parcel = mongoose.model<IParcel>('Parcel', parcelSchema);
