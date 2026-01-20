import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';
import { hashPassword, comparePassword } from '../utils/password.utils';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false,
    },
    role: {
      type: String,
      enum: ['client', 'compagnie', 'admin'],
      default: 'client',
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return comparePassword(candidatePassword, this.password);
};

// Index for faster queries (email and phone already indexed via unique: true)
userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
