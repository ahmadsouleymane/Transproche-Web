'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import { Trip, Ticket } from '@/types';
import { formatDate } from '@/lib/utils';
import { Loader2, ClipboardList, Users, MapPin, Clock, Calendar, Printer, Download, CheckCircle } from 'lucide-react';

export default function ManifestPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Fetch company trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips/company');
        setTrips(response.data.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Fetch tickets for selected trip and date
  useEffect(() => {
    const fetchTickets = async () => {
      if (!selectedTrip || !selectedDate) {
        setTickets([]);
        return;
      }

      setIsLoadingTickets(true);
      try {
        const response = await api.get('/tickets/company');
        const allTickets = response.data.data?.tickets || [];

        // Filter by selected trip and date
        const filtered = allTickets.filter((ticket: any) => {
          const ticketDate = new Date(ticket.travelDate).toISOString().split('T')[0];
          return ticket.trip?._id === selectedTrip && ticketDate === selectedDate;
        });

        setTickets(filtered);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoadingTickets(false);
      }
    };
    fetchTickets();
  }, [selectedTrip, selectedDate]);

  const selectedTripData = trips.find(t => t._id === selectedTrip);

  const totalPassengers = tickets.reduce((sum, t) => sum + t.seats, 0);
  const confirmedTickets = tickets.filter(t => t.status === 'confirme' || t.status === 'paye_livraison');
  const confirmedPassengers = confirmedTickets.reduce((sum, t) => sum + t.seats, 0);

  const handlePrint = () => {
    window.print();
  };

  const tripOptions = [
    { value: '', label: 'Sélectionner un trajet' },
    ...trips.map(trip => ({
      value: trip._id,
      label: `${trip.departure} → ${trip.arrival} (${trip.departureTime})`,
    })),
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manifeste des passagers</h1>
          <p className="text-gray-600 mt-1">Liste des passagers par trajet et date</p>
        </div>
        {selectedTrip && tickets.length > 0 && (
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Trajet
              </label>
              <Select
                options={tripOptions}
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date de voyage
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Info and Stats */}
      {selectedTrip && selectedTripData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trajet</p>
                  <p className="font-semibold">{selectedTripData.departure} → {selectedTripData.arrival}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heure de départ</p>
                  <p className="font-semibold">{selectedTripData.departureTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passagers confirmés</p>
                  <p className="font-semibold">{confirmedPassengers} / {selectedTripData.totalSeats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total réservations</p>
                  <p className="font-semibold">{tickets.length} ({totalPassengers} places)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Passenger List */}
      {!selectedTrip ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez un trajet</h3>
            <p className="text-gray-600">
              Choisissez un trajet et une date pour voir la liste des passagers
            </p>
          </CardContent>
        </Card>
      ) : isLoadingTickets ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-gray-600">
              Aucune réservation pour ce trajet le {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print:border-black">
          {/* Print Header */}
          <div className="hidden print:block p-4 border-b text-center">
            <h2 className="text-xl font-bold">MANIFESTE DES PASSAGERS</h2>
            <p>{selectedTripData?.departure} → {selectedTripData?.arrival}</p>
            <p>Date: {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Heure de départ: {selectedTripData?.departureTime}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b print:bg-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">#</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">N° Réservation</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Passager</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Téléphone</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Places</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 print:hidden">Embarqué</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket, index) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-primary-600">
                        {ticket.reservationNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{ticket.passengerInfo?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{ticket.passengerInfo?.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{ticket.seats} place(s)</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ticket.status === 'confirme' ? 'success' :
                          ticket.status === 'paye_livraison' ? 'info' :
                          ticket.status === 'annule' ? 'danger' :
                          'warning'
                        }
                      >
                        {ticket.status === 'confirme' ? 'Confirmé' :
                         ticket.status === 'paye_livraison' ? 'Paiement livraison' :
                         ticket.status === 'annule' ? 'Annulé' :
                         ticket.status === 'en_attente' ? 'En attente' : ticket.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 print:hidden">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={4} className="px-4 py-3 font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-4 py-3 font-bold text-primary-600">
                    {totalPassengers} places
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block p-4 border-t text-center text-sm text-gray-500">
            <p>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .space-y-6, .space-y-6 * {
            visibility: visible;
          }
          .space-y-6 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
