import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User roles
export type UserRole = 'client' | 'compagnie' | 'admin';

// Ticket status
export type TicketStatus = 'en_attente' | 'paye_livraison' | 'confirme' | 'annule' | 'expire';

// Parcel status
export type ParcelStatus = 'en_attente' | 'collecte' | 'en_transit' | 'livre' | 'annule';

// Parcel type
export type ParcelType = 'petit' | 'moyen' | 'gros';

// Company status
export type CompanyStatus = 'active' | 'inactive' | 'pending';

// Trip status
export type TripStatus = 'active' | 'inactive';

// Payment method
export type PaymentMethod = 'livraison';

// User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  company?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Company interface
export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  logo?: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  commission: number;
  status: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Trip interface
export interface ITrip extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  departure: string;
  arrival: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  daysOfWeek: number[];
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Passenger info
export interface IPassengerInfo {
  name: string;
  phone: string;
}

// Ticket interface
export interface ITicket extends Document {
  _id: Types.ObjectId;
  reservationNumber: string;
  user: Types.ObjectId;
  company: Types.ObjectId;
  trip: Types.ObjectId;
  travelDate: Date;
  seats: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: TicketStatus;
  passengerInfo: IPassengerInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Sender/Receiver info
export interface IPersonInfo {
  name: string;
  phone: string;
  address: string;
}

// Parcel interface
export interface IParcel extends Document {
  _id: Types.ObjectId;
  trackingNumber: string;
  sender: IPersonInfo;
  receiver: IPersonInfo;
  user: Types.ObjectId;
  company: Types.ObjectId;
  type: ParcelType;
  description?: string;
  price: number;
  paymentMethod: PaymentMethod;
  status: ParcelStatus;
  departure: string;
  arrival: string;
  createdAt: Date;
  updatedAt: Date;
}

// Advertisement interface
export interface IAdvertisement extends Document {
  _id: Types.ObjectId;
  title: string;
  image: string;
  link?: string;
  active: boolean;
  position: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Request with user
export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  role: UserRole;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
