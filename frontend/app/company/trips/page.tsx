'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import { Trip, NIGER_CITIES, DAY_NAMES } from '@/types';
import { formatPrice, formatTime } from '@/lib/utils';
import { Loader2, Plus, Route, Edit, Trash2 } from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    departure: '', arrival: '', departureTime: '', price: '', totalSeats: '', daysOfWeek: [] as number[],
  });

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips/company/my');
      setTrips(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTrips(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, price: Number(formData.price), totalSeats: Number(formData.totalSeats) };
      if (editingTrip) {
        await api.put(`/trips/${editingTrip._id}`, data);
      } else {
        await api.post('/trips', data);
      }
      setIsModalOpen(false);
      setEditingTrip(null);
      setFormData({ departure: '', arrival: '', departureTime: '', price: '', totalSeats: '', daysOfWeek: [] });
      fetchTrips();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      departure: trip.departure, arrival: trip.arrival, departureTime: trip.departureTime,
      price: String(trip.price), totalSeats: String(trip.totalSeats), daysOfWeek: trip.daysOfWeek,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (tripId: string) => {
    if (confirm('Supprimer ce trajet ?')) {
      await api.delete(`/trips/${tripId}`);
      fetchTrips();
    }
  };

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const cityOptions = [{ value: '', label: 'Sélectionner' }, ...NIGER_CITIES.map((c) => ({ value: c, label: c }))];

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trajets</h1>
        <Button onClick={() => { setEditingTrip(null); setFormData({ departure: '', arrival: '', departureTime: '', price: '', totalSeats: '', daysOfWeek: [] }); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Nouveau trajet
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun trajet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <Card key={trip._id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{trip.departure} → {trip.arrival}</p>
                  <p className="text-sm text-gray-500">Départ: {formatTime(trip.departureTime)}</p>
                </div>
                <div className="flex gap-1">
                  {trip.daysOfWeek.sort().map((day) => (
                    <Badge key={day} variant="info">{DAY_NAMES[day]}</Badge>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-primary-600">{formatPrice(trip.price)}</p>
                  <p className="text-sm text-gray-500">{trip.availableSeats}/{trip.totalSeats} places</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(trip)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(trip._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTrip ? 'Modifier le trajet' : 'Nouveau trajet'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Départ" options={cityOptions} value={formData.departure} onChange={(e) => setFormData({ ...formData, departure: e.target.value })} required />
            <Select label="Arrivée" options={cityOptions} value={formData.arrival} onChange={(e) => setFormData({ ...formData, arrival: e.target.value })} required />
          </div>
          <Input label="Heure de départ" type="time" value={formData.departureTime} onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prix (FCFA)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            <Input label="Nombre de places" type="number" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} required />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Jours de circulation</p>
            <div className="flex flex-wrap gap-2">
              {DAY_NAMES.map((name, index) => (
                <button key={index} type="button" onClick={() => toggleDay(index)}
                  className={`px-3 py-1 rounded-full text-sm ${formData.daysOfWeek.includes(index) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">{editingTrip ? 'Modifier' : 'Créer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
