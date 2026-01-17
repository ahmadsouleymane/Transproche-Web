import mongoose, { Schema } from 'mongoose';
import { ITrip } from '../types';
import { NIGER_CITIES } from '../config/cities';

const tripSchema = new Schema<ITrip>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'La compagnie est requise'],
    },
    departure: {
      type: String,
      required: [true, 'La ville de départ est requise'],
      enum: {
        values: NIGER_CITIES,
        message: 'Ville de départ invalide',
      },
    },
    arrival: {
      type: String,
      required: [true, 'La ville d\'arrivée est requise'],
      enum: {
        values: NIGER_CITIES,
        message: 'Ville d\'arrivée invalide',
      },
    },
    departureTime: {
      type: String,
      required: [true, 'L\'heure de départ est requise'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Le nombre de places disponibles est requis'],
      min: [0, 'Le nombre de places ne peut pas être négatif'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Le nombre total de places est requis'],
      min: [1, 'Le nombre total de places doit être au moins 1'],
    },
    daysOfWeek: {
      type: [Number],
      required: [true, 'Les jours de la semaine sont requis'],
      validate: {
        validator: function (days: number[]) {
          return days.every(day => day >= 0 && day <= 6);
        },
        message: 'Les jours doivent être entre 0 (Dimanche) et 6 (Samedi)',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Validation: departure and arrival must be different
tripSchema.pre('save', function (next) {
  if (this.departure === this.arrival) {
    next(new Error('La ville de départ et d\'arrivée doivent être différentes'));
  }
  next();
});

// Index for faster queries
tripSchema.index({ company: 1 });
tripSchema.index({ departure: 1, arrival: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ daysOfWeek: 1 });

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
