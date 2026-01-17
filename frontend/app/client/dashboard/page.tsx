'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Ticket, Parcel, TICKET_STATUS_LABELS, PARCEL_STATUS_LABELS } from '@/types';
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils';
import { Ticket as TicketIcon, Package, Search, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, parcelsRes] = await Promise.all([
          api.get('/tickets?limit=5'),
          api.get('/parcels?limit=5'),
        ]);
        setTickets(ticketsRes.data.data?.tickets || []);
        setParcels(parcelsRes.data.data?.parcels || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {user?.name} !</h1>
        <p className="text-gray-600">Bienvenue sur votre espace client.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tickets.length}</p>
              <p className="text-gray-500 text-sm">Réservations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{parcels.length}</p>
              <p className="text-gray-500 text-sm">Colis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Link href="/search">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Réserver un billet
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Réservations récentes</CardTitle>
            <Link href="/client/bookings" className="text-sm text-primary-600 hover:underline flex items-center">
              Voir tout <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune réservation</p>
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{ticket.reservationNumber}</p>
                      <p className="text-sm text-gray-500">{formatDate(ticket.travelDate)}</p>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>{TICKET_STATUS_LABELS[ticket.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Colis récents</CardTitle>
            <Link href="/client/parcels" className="text-sm text-primary-600 hover:underline flex items-center">
              Voir tout <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {parcels.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun colis</p>
            ) : (
              <div className="space-y-3">
                {parcels.slice(0, 3).map((parcel) => (
                  <div key={parcel._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{parcel.trackingNumber}</p>
                      <p className="text-sm text-gray-500">{parcel.departure} → {parcel.arrival}</p>
                    </div>
                    <Badge className={getStatusColor(parcel.status)}>{PARCEL_STATUS_LABELS[parcel.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
