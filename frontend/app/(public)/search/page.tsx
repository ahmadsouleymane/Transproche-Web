'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TicketSearchForm from '@/components/features/TicketSearchForm';
import TicketCard from '@/components/features/TicketCard';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';
import { Trip, Company } from '@/types';
import { Loader2, SearchX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<(Trip & { company: Company })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const departure = searchParams.get('departure') || '';
  const arrival = searchParams.get('arrival') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    const fetchTrips = async () => {
      if (!departure && !arrival) return;

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (departure) params.set('departure', departure);
        if (arrival) params.set('arrival', arrival);
        if (date) params.set('date', date);

        const response = await api.get(`/trips/search?${params.toString()}`);
        setTrips(response.data.data || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [departure, arrival, date]);

  const handleBook = (tripId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/ticket/${tripId}?date=${date || new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Rechercher un trajet</h1>

          <div className="mb-8">
            <TicketSearchForm />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : trips.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                {trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
              </p>
              {trips.map((trip) => (
                <TicketCard
                  key={trip._id}
                  trip={trip}
                  onBook={() => handleBook(trip._id)}
                />
              ))}
            </div>
          ) : departure || arrival ? (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun trajet trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">
                  Utilisez le formulaire ci-dessus pour rechercher des trajets.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
