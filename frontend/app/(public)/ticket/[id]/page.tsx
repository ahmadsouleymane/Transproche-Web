'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Trip, Company } from '@/types';
import { formatTime } from '@/lib/utils';
import { Loader2, ArrowRight, Clock, Users, CheckCircle, AlertCircle, Minus, Plus, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function TicketBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [trip, setTrip] = useState<(Trip & { company: Company }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservationNumber, setReservationNumber] = useState('');

  const [seats, setSeats] = useState(1);
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerPhone: '',
  });

  const travelDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) return;

    if (!isAuthenticated) {
      // Redirect to login with return URL
      const currentUrl = `${pathname}?date=${travelDate}`;
      router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    const fetchTrip = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data.data);
      } catch (error) {
        console.error('Error fetching trip:', error);
        setError('Trajet non trouvé');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();

    if (user) {
      setFormData({
        passengerName: user.name,
        passengerPhone: user.phone,
      });
    }
  }, [tripId, isAuthenticated, authLoading, router, user, pathname, travelDate]);

  const handleSeatsChange = (delta: number) => {
    const newSeats = seats + delta;
    if (newSeats >= 1 && newSeats <= (trip?.availableSeats || 1)) {
      setSeats(newSeats);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/tickets', {
        tripId,
        travelDate,
        seats,
        passengerInfo: {
          name: formData.passengerName,
          phone: formData.passengerPhone,
        },
      });

      setReservationNumber(response.data.data.reservationNumber);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="max-w-lg mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Trajet non trouvé</h2>
                <p className="text-gray-600 mb-6">Ce trajet n'existe pas ou n'est plus disponible.</p>
                <Button onClick={() => router.push('/search')}>Rechercher un autre trajet</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="max-w-lg mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
                <p className="text-gray-600 mb-4">Votre numéro de réservation :</p>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-2xl font-mono font-bold text-primary-600">{reservationNumber}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-blue-700 text-sm">
                    <strong>Rappel :</strong> Présentez ce numéro de réservation à l'agence le jour du voyage.
                    Paiement à effectuer sur place.
                  </p>
                </div>
                <div className="space-y-2 text-left mb-6 bg-gray-50 rounded-lg p-4">
                  <p><strong>Trajet :</strong> {trip.departure} → {trip.arrival}</p>
                  <p><strong>Date :</strong> {new Date(travelDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Heure :</strong> {formatTime(trip.departureTime)}</p>
                  <p><strong>Places :</strong> {seats}</p>
                </div>
                <Button onClick={() => router.push('/client/bookings')}>Voir mes réservations</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Réserver un billet</h1>

          {/* Trip Summary Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {trip.company.logo ? (
                    <Image
                      src={`${apiUrl}${trip.company.logo}`}
                      alt={trip.company.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">
                      {trip.company.name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{trip.company.name}</h2>
                  <p className="text-gray-500">{trip.company.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="text-xl font-bold">{trip.departure}</p>
                </div>
                <div className="flex items-center text-gray-400 flex-1 justify-center">
                  <div className="w-12 h-px bg-gray-300" />
                  <ArrowRight className="h-5 w-5 mx-2" />
                  <div className="w-12 h-px bg-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="text-xl font-bold">{trip.arrival}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-gray-600 border-t pt-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{formatTime(trip.departureTime)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{new Date(travelDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{trip.availableSeats} places dispo.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de réservation</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-5 w-5" /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seats Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre de places
                  </label>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleSeatsChange(-1)}
                      disabled={seats <= 1}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <div className="w-24 text-center">
                      <span className="text-4xl font-bold text-primary-600">{seats}</span>
                      <p className="text-sm text-gray-500">place{seats > 1 ? 's' : ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSeatsChange(1)}
                      disabled={seats >= trip.availableSeats}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Maximum : {trip.availableSeats} places disponibles
                  </p>
                </div>

                <hr />

                {/* Passenger Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Informations du passager principal</h3>
                  <Input
                    label="Nom complet"
                    value={formData.passengerName}
                    onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                    required
                  />
                  <Input
                    label="Téléphone"
                    value={formData.passengerPhone}
                    onChange={(e) => setFormData({ ...formData, passengerPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Paiement à l'agence :</strong> Le paiement s'effectue directement à l'agence le jour du voyage.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                  Confirmer la réservation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
