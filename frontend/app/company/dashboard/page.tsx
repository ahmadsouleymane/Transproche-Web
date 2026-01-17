'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Ticket, TICKET_STATUS_LABELS } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Ticket as TicketIcon, Route, Package, TrendingUp } from 'lucide-react';

export default function CompanyDashboard() {
  const [stats, setStats] = useState({ tickets: 0, trips: 0, pendingTickets: 0 });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, tripsRes] = await Promise.all([
          api.get('/tickets/company?limit=5'),
          api.get('/trips/company/my'),
        ]);
        const tickets = ticketsRes.data.data?.tickets || [];
        setRecentTickets(tickets);
        setStats({
          tickets: ticketsRes.data.data?.pagination?.total || tickets.length,
          trips: tripsRes.data.data?.length || 0,
          pendingTickets: tickets.filter((t: Ticket) => t.status === 'en_attente').length,
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.tickets}</p>
              <p className="text-gray-500 text-sm">Réservations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Route className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.trips}</p>
              <p className="text-gray-500 text-sm">Trajets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingTickets}</p>
              <p className="text-gray-500 text-sm">En attente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Réservations récentes</CardTitle></CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune réservation</p>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ticket.reservationNumber}</p>
                    <p className="text-sm text-gray-500">{ticket.passengerInfo.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm">{formatDate(ticket.travelDate)}</p>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>{TICKET_STATUS_LABELS[ticket.status]}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
