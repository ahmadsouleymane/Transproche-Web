import mongoose, { Schema } from 'mongoose';
import { ITicket } from '../types';
import { generateReservationNumber } from '../utils/reservationNumber.utils';

const passengerInfoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du passager est requis'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone du passager est requis'],
      trim: true,
    },
  },
  { _id: false }
);

const ticketSchema = new Schema<ITicket>(
  {
    reservationNumber: {
      type: String,
      unique: true,
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
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Le trajet est requis'],
    },
    travelDate: {
      type: Date,
      required: [true, 'La date de voyage est requise'],
    },
    seats: {
      type: Number,
      required: [true, 'Le nombre de places est requis'],
      min: [1, 'Le nombre de places doit être au moins 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Le prix total est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    paymentMethod: {
      type: String,
      enum: ['livraison'],
      default: 'livraison',
    },
    status: {
      type: String,
      enum: ['en_attente', 'paye_livraison', 'confirme', 'annule', 'expire'],
      default: 'en_attente',
    },
    passengerInfo: {
      type: passengerInfoSchema,
      required: [true, 'Les informations du passager sont requises'],
    },
  },
  {
    timestamps: true,
  }
);

// Generate reservation number before saving
ticketSchema.pre('save', function (next) {
  if (!this.reservationNumber) {
    this.reservationNumber = generateReservationNumber();
  }
  next();
});

// Index for faster queries
ticketSchema.index({ user: 1 });
ticketSchema.index({ company: 1 });
ticketSchema.index({ reservationNumber: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ travelDate: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
