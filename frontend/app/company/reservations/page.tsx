'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import { Ticket, TICKET_STATUS_LABELS, Trip, User } from '@/types';
import { formatDate, formatPrice, formatTime, getStatusColor } from '@/lib/utils';
import { Loader2, Ticket as TicketIcon } from 'lucide-react';

export default function ReservationsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/company');
      setTickets(response.data.data?.tickets || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const updateStatus = async (ticketId: string, status: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status });
      fetchTickets();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const statusOptions = Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label }));

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Réservations</h1>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune réservation</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const trip = ticket.trip as Trip;
            const user = ticket.user as User;
            return (
              <Card key={ticket._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="font-mono font-bold">{ticket.reservationNumber}</p>
                      <p className="text-sm text-gray-500">{user?.name} - {user?.phone}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{trip?.departure} → {trip?.arrival}</p>
                      <p className="text-sm text-gray-500">{formatDate(ticket.travelDate)} - {formatTime(trip?.departureTime || '')}</p>
                    </div>
                    <div>
                      <p className="text-sm">{ticket.seats} place(s)</p>
                      <p className="font-bold text-primary-600">{formatPrice(ticket.totalPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        options={statusOptions}
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket._id, e.target.value)}
                        className="w-40"
                      />
                    </div>
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
