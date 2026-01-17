export type UserRole = 'client' | 'compagnie' | 'admin';
export type TicketStatus = 'en_attente' | 'paye_livraison' | 'confirme' | 'annule' | 'expire';
export type ParcelStatus = 'en_attente' | 'collecte' | 'en_transit' | 'livre' | 'annule';
export type ParcelType = 'petit' | 'moyen' | 'gros';
export type CompanyStatus = 'active' | 'inactive' | 'pending';
export type TripStatus = 'active' | 'inactive';

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  commission: number;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  _id: string;
  company: Company | string;
  departure: string;
  arrival: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  daysOfWeek: number[];
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PassengerInfo {
  name: string;
  phone: string;
}

export interface Ticket {
  _id: string;
  reservationNumber: string;
  user: User | string;
  company: Company | string;
  trip: Trip | string;
  travelDate: string;
  seats: number;
  totalPrice: number;
  paymentMethod: 'livraison';
  status: TicketStatus;
  passengerInfo: PassengerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface PersonInfo {
  name: string;
  phone: string;
  address: string;
}

export interface Parcel {
  _id: string;
  trackingNumber: string;
  sender: PersonInfo;
  receiver: PersonInfo;
  user: User | string;
  company: Company | string;
  type: ParcelType;
  description?: string;
  price: number;
  paymentMethod: 'livraison';
  status: ParcelStatus;
  departure: string;
  arrival: string;
  createdAt: string;
  updatedAt: string;
}

export interface Advertisement {
  _id: string;
  title: string;
  image: string;
  link?: string;
  active: boolean;
  position: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const NIGER_CITIES = [
  'Niamey',
  'Zinder',
  'Maradi',
  'Tahoua',
  'Agadez',
  'Dosso',
  'Diffa',
  'Tillabéri',
  'Arlit',
  "Birni N'Konni",
] as const;

export type NigerCity = (typeof NIGER_CITIES)[number];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  en_attente: 'En attente',
  paye_livraison: 'Payé à la livraison',
  confirme: 'Confirmé',
  annule: 'Annulé',
  expire: 'Expiré',
};

export const PARCEL_STATUS_LABELS: Record<ParcelStatus, string> = {
  en_attente: 'En attente',
  collecte: 'Collecté',
  en_transit: 'En transit',
  livre: 'Livré',
  annule: 'Annulé',
};

export const PARCEL_TYPE_LABELS: Record<ParcelType, string> = {
  petit: 'Petit colis',
  moyen: 'Moyen colis',
  gros: 'Gros colis',
};

export const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
