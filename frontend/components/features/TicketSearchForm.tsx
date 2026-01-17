'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { NIGER_CITIES } from '@/types';
import { Search, ArrowRight } from 'lucide-react';

interface TicketSearchFormProps {
  compact?: boolean;
}

const TicketSearchForm = ({ compact = false }: TicketSearchFormProps) => {
  const router = useRouter();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');

  const cityOptions = [
    { value: '', label: 'Sélectionner une ville' },
    ...NIGER_CITIES.map((city) => ({ value: city, label: city })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (departure) params.set('departure', departure);
    if (arrival) params.set('arrival', arrival);
    if (date) params.set('date', date);
    router.push(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Select
          options={cityOptions}
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="flex-1"
        />
        <Select
          options={cityOptions}
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          className="flex-1"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Départ"
          options={cityOptions}
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <Select
          label="Arrivée"
          options={cityOptions}
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg">
            <Search className="h-5 w-5 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TicketSearchForm;
