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
import { Loader2, SearchX, Filter, SortAsc, SortDesc, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FilterState {
  company: string;
  sortBy: 'time';
  sortOrder: 'asc' | 'desc';
}

interface FiltersData {
  companies: { _id: string; name: string }[];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<(Trip & { company: Company })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);

  const departure = searchParams.get('departure') || '';
  const arrival = searchParams.get('arrival') || '';
  const date = searchParams.get('date') || '';

  const [filters, setFilters] = useState<FilterState>({
    company: '',
    sortBy: 'time',
    sortOrder: 'asc',
  });

  useEffect(() => {
    const fetchTrips = async () => {
      if (!departure && !arrival) return;

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (departure) params.set('departure', departure);
        if (arrival) params.set('arrival', arrival);
        if (date) params.set('date', date);
        if (filters.company) params.set('company', filters.company);
        params.set('sortBy', filters.sortBy);
        params.set('sortOrder', filters.sortOrder);

        const response = await api.get(`/trips/search?${params.toString()}`);
        setTrips(response.data.data || []);
        if (response.data.filters) {
          setFiltersData(response.data.filters);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [departure, arrival, date, filters]);

  const handleBook = (tripId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/ticket/${tripId}?date=${date || new Date().toISOString().split('T')[0]}`)}`);
      return;
    }
    router.push(`/ticket/${tripId}?date=${date || new Date().toISOString().split('T')[0]}`);
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      sortBy: 'time',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = filters.company;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Rechercher un trajet</h1>

          <div className="mb-8">
            <TicketSearchForm />
          </div>

          {(departure || arrival) && (
            <div className="mb-6">
              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    hasActiveFilters
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                  {hasActiveFilters && (
                    <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Trier par heure de départ:</span>
                  <button
                    onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                    className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                    title={filters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
                  >
                    {filters.sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-4 w-4" />
                    <span>Effacer les filtres</span>
                  </button>
                )}
              </div>

              {/* Filter Panel */}
              {showFilters && filtersData && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compagnie
                    </label>
                    <select
                      value={filters.company}
                      onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                      className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Toutes les compagnies</option>
                      {filtersData.companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="mt-4 text-gray-600">Recherche des trajets...</p>
            </div>
          ) : trips.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{trips.length}</span> trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
                  {date && (
                    <span className="ml-2">
                      pour le {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  )}
                </p>
              </div>

              <div className="grid gap-4">
                {trips.map((trip) => (
                  <TicketCard
                    key={trip._id}
                    trip={trip}
                    onBook={() => handleBook(trip._id)}
                  />
                ))}
              </div>
            </div>
          ) : departure || arrival ? (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun trajet trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Aucun trajet disponible pour {departure} → {arrival}
                  {date && ` le ${new Date(date).toLocaleDateString('fr-FR')}`}.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Essayer sans les filtres
                  </button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchX className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Recherchez votre trajet
                  </h3>
                  <p className="text-gray-600">
                    Utilisez le formulaire ci-dessus pour trouver les meilleurs trajets de bus disponibles.
                  </p>
                </div>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
