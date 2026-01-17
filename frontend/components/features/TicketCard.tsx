'use client';

import { Trip, Company } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatPrice, formatTime } from '@/lib/utils';
import { Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface TicketCardProps {
  trip: Trip & { company: Company };
  onBook: () => void;
}

const TicketCard = ({ trip, onBook }: TicketCardProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Company Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {trip.company.logo ? (
                <Image
                  src={`${apiUrl}${trip.company.logo}`}
                  alt={trip.company.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  {trip.company.name[0]}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{trip.company.name}</p>
              <p className="text-sm text-gray-500">{trip.company.phone}</p>
            </div>
          </div>

          {/* Route Info */}
          <div className="flex items-center space-x-4 flex-1 justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">Départ</p>
              <p className="font-semibold">{trip.departure}</p>
            </div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-px bg-gray-300" />
              <ArrowRight className="h-4 w-4 mx-1" />
              <div className="w-8 h-px bg-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Arrivée</p>
              <p className="font-semibold">{trip.arrival}</p>
            </div>
          </div>

          {/* Time and Seats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(trip.departureTime)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>{trip.availableSeats} places</span>
            </div>
          </div>

          {/* Price and Book */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{formatPrice(trip.price)}</p>
              <p className="text-xs text-gray-500">par personne</p>
            </div>
            <Button onClick={onBook} disabled={trip.availableSeats === 0}>
              {trip.availableSeats === 0 ? 'Complet' : 'Réserver'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
