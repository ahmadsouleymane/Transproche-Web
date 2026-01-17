'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Parcel, PARCEL_STATUS_LABELS, PARCEL_TYPE_LABELS, Company } from '@/types';
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils';
import { Loader2, Package } from 'lucide-react';

export default function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await api.get('/parcels');
        setParcels(response.data.data?.parcels || []);
      } catch (error) {
        console.error('Error fetching parcels:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParcels();
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
      <h1 className="text-2xl font-bold">Mes colis</h1>

      {parcels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun colis pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => {
            const company = parcel.company as Company;
            return (
              <Card key={parcel._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-mono font-bold text-lg">{parcel.trackingNumber}</p>
                        <Badge className={getStatusColor(parcel.status)}>{PARCEL_STATUS_LABELS[parcel.status]}</Badge>
                      </div>
                      <p className="text-gray-600">{company?.name}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{parcel.departure} → {parcel.arrival}</p>
                      <p className="text-sm text-gray-500">{PARCEL_TYPE_LABELS[parcel.type]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(parcel.createdAt)}</p>
                      <p className="text-xl font-bold text-primary-600">{formatPrice(parcel.price)}</p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Expéditeur</p>
                      <p className="font-medium">{parcel.sender.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Destinataire</p>
                      <p className="font-medium">{parcel.receiver.name}</p>
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
