'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Parcel, PARCEL_STATUS_LABELS, PARCEL_TYPE_LABELS } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';
import { Search, Package, CheckCircle, Truck, MapPin, AlertCircle } from 'lucide-react';

const statusSteps = [
  { key: 'en_attente', label: 'En attente', icon: Package },
  { key: 'collecte', label: 'Collecté', icon: CheckCircle },
  { key: 'en_transit', label: 'En transit', icon: Truck },
  { key: 'livre', label: 'Livré', icon: MapPin },
];

const ParcelTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setError('');
    setIsLoading(true);
    setParcel(null);
    try {
      const response = await api.get(`/parcels/track/${trackingNumber}`);
      setParcel(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Colis non trouvé');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (!parcel || parcel.status === 'annule') return -1;
    return statusSteps.findIndex((s) => s.key === parcel.status);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleTrack} className="flex gap-3">
        <Input
          placeholder="Numéro de suivi (ex: COL-XXXXX)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Suivre
        </Button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {parcel && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Numéro de suivi</p>
                <p className="text-xl font-mono font-bold">{parcel.trackingNumber}</p>
              </div>
              <Badge variant={parcel.status === 'livre' ? 'success' : parcel.status === 'annule' ? 'danger' : 'info'}>
                {PARCEL_STATUS_LABELS[parcel.status]}
              </Badge>
            </div>

            {parcel.status !== 'annule' && (
              <div className="flex justify-between mb-6">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= getCurrentStep();
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className={`text-xs mt-2 ${isActive ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Expéditeur</h4>
                <p>{parcel.sender.name}</p>
                <p className="text-gray-600">{parcel.sender.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Destinataire</h4>
                <p>{parcel.receiver.name}</p>
                <p className="text-gray-600">{parcel.receiver.phone}</p>
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Trajet</p>
                <p className="font-medium">{parcel.departure} → {parcel.arrival}</p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium">{PARCEL_TYPE_LABELS[parcel.type]}</p>
              </div>
              <div>
                <p className="text-gray-500">Prix</p>
                <p className="font-medium">{formatPrice(parcel.price)}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{formatDate(parcel.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParcelTracker;
