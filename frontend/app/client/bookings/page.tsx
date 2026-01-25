'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Ticket, TICKET_STATUS_LABELS, Company, Trip } from '@/types';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import { Loader2, Ticket as TicketIcon } from 'lucide-react';

export default function BookingsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data.data?.tickets || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes réservations</h1>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune réservation pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const company = ticket.company as Company;
            const trip = ticket.trip as Trip;
            return (
              <Card key={ticket._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-mono font-bold text-lg">{ticket.reservationNumber}</p>
                        <Badge className={getStatusColor(ticket.status)}>{TICKET_STATUS_LABELS[ticket.status]}</Badge>
                      </div>
                      <p className="text-gray-600">{company?.name}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{trip?.departure} → {trip?.arrival}</p>
                      <p className="text-sm text-gray-500">{formatDate(ticket.travelDate)} à {formatTime(trip?.departureTime || '')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{ticket.seats} place(s)</p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Passager:</span> {ticket.passengerInfo.name} - {ticket.passengerInfo.phone}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
