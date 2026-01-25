'use client';

import { Trip, Company } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatTime } from '@/lib/utils';
import { Clock, Users, ArrowRight, Bus } from 'lucide-react';
import Image from 'next/image';

interface TicketCardProps {
  trip: Trip & { company: Company };
  onBook: () => void;
}

const TicketCard = ({ trip, onBook }: TicketCardProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const logoSrc = trip.company.logo?.startsWith('http')
    ? trip.company.logo
    : trip.company.logo
      ? `${apiUrl}${trip.company.logo}`
      : null;

  return (
    <Card className="group hover:shadow-lg hover:border-primary-200 transition-all duration-200">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Company Section */}
          <div className="p-4 lg:p-5 lg:w-52 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
            <div className="flex lg:flex-col items-center lg:items-start gap-3">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={trip.company.name}
                    width={56}
                    height={56}
                    className="object-contain p-1"
                  />
                ) : (
                  <Bus className="h-7 w-7 text-primary-500" />
                )}
              </div>
              <div className="lg:mt-2">
                <p className="font-semibold text-gray-900 text-sm">{trip.company.name}</p>
                {trip.company.phone && (
                  <p className="text-xs text-gray-500 mt-0.5">{trip.company.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Route */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Départ</p>
                  <p className="text-lg font-bold text-gray-900">{trip.departure}</p>
                </div>
                <div className="flex items-center text-primary-400">
                  <div className="w-6 sm:w-10 h-0.5 bg-primary-200 rounded" />
                  <ArrowRight className="h-5 w-5 mx-1" />
                  <div className="w-6 sm:w-10 h-0.5 bg-primary-200 rounded" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Arrivée</p>
                  <p className="text-lg font-bold text-gray-900">{trip.arrival}</p>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="h-4 w-4 text-primary-500" />
                    <span className="font-medium">{formatTime(trip.departureTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="h-4 w-4 text-primary-500" />
                    <span className="font-medium">{trip.availableSeats} places</span>
                  </div>
                </div>

                <Button
                  onClick={onBook}
                  disabled={trip.availableSeats === 0}
                  className="min-w-[100px]"
                >
                  {trip.availableSeats === 0 ? 'Complet' : 'Réserver'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
