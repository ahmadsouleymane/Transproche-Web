'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Parcel, PARCEL_STATUS_LABELS, PARCEL_TYPE_LABELS, PARCEL_MODE_LABELS, Company } from '@/types';
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils';
import { Loader2, Package, Send, Download, MapPin, Building2, FileImage } from 'lucide-react';
import Image from 'next/image';

export default function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedParcel, setExpandedParcel] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

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
            const isExpanded = expandedParcel === parcel._id;
            const isRecuperation = parcel.parcelMode === 'recuperation';

            return (
              <Card key={parcel._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-mono font-bold text-lg">{parcel.trackingNumber}</p>
                        <Badge className={getStatusColor(parcel.status)}>{PARCEL_STATUS_LABELS[parcel.status]}</Badge>
                        <Badge className={isRecuperation ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                          {isRecuperation ? <Download className="h-3 w-3 mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                          {PARCEL_MODE_LABELS[parcel.parcelMode] || 'Envoi'}
                        </Badge>
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
                      <p className="text-gray-500">{isRecuperation ? 'Expéditeur original' : 'Expéditeur'}</p>
                      <p className="font-medium">{parcel.sender.name}</p>
                      <p className="text-gray-600">{parcel.sender.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{isRecuperation ? 'Récupérateur' : 'Destinataire'}</p>
                      <p className="font-medium">{parcel.receiver.name}</p>
                      <p className="text-gray-600">{parcel.receiver.phone}</p>
                    </div>
                  </div>

                  {/* Mode-specific details */}
                  {(isRecuperation || parcel.pickupLocation) && (
                    <>
                      <hr className="my-3" />
                      {isRecuperation ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-purple-700 bg-purple-50 p-2 rounded-lg">
                            <Building2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Société de récupération: {parcel.pickupCompany}</span>
                          </div>

                          <button
                            onClick={() => setExpandedParcel(isExpanded ? null : parcel._id)}
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            <FileImage className="h-4 w-4" />
                            {isExpanded ? 'Masquer les documents' : 'Voir les documents'}
                          </button>

                          {isExpanded && (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              {parcel.receiptPhoto && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Photo du reçu</p>
                                  <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                      src={`${apiUrl}${parcel.receiptPhoto}`}
                                      alt="Reçu"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              {parcel.idPhoto && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-2">Pièce d'identité</p>
                                  <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                      src={`${apiUrl}${parcel.idPhoto}`}
                                      alt="Pièce d'identité"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : parcel.pickupLocation ? (
                        <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded-lg">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm font-medium">Lieu de récupération: {parcel.pickupLocation}</span>
                        </div>
                      ) : null}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
