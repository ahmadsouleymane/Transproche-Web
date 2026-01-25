'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import { Parcel } from '@/types';
import { formatDate } from '@/lib/utils';
import { Loader2, Package, MapPin, User, Phone, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'collecte', label: 'Collecté' },
  { value: 'en_transit', label: 'En transit' },
  { value: 'livre', label: 'Livré' },
  { value: 'annule', label: 'Annulé' },
];

const statusActions = [
  { value: 'en_attente', label: 'En attente', icon: Clock, color: 'text-yellow-600' },
  { value: 'collecte', label: 'Collecté', icon: Package, color: 'text-blue-600' },
  { value: 'en_transit', label: 'En transit', icon: Truck, color: 'text-purple-600' },
  { value: 'livre', label: 'Livré', icon: CheckCircle, color: 'text-green-600' },
  { value: 'annule', label: 'Annulé', icon: XCircle, color: 'text-red-600' },
];

export default function CompanyParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchParcels = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const response = await api.get(`/parcels/company?${params.toString()}`);
      setParcels(response.data.data?.parcels || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, [statusFilter]);

  const handleUpdateStatus = async (parcelId: string, newStatus: string) => {
    setUpdatingId(parcelId);
    try {
      await api.patch(`/parcels/${parcelId}/status`, { status: newStatus });
      fetchParcels();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'warning' | 'info' | 'success' | 'danger' }> = {
      'en_attente': { label: 'En attente', variant: 'warning' },
      'collecte': { label: 'Collecté', variant: 'info' },
      'en_transit': { label: 'En transit', variant: 'info' },
      'livre': { label: 'Livré', variant: 'success' },
      'annule': { label: 'Annulé', variant: 'danger' },
    };
    const s = statusMap[status] || { label: status, variant: 'default' };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const getParcelTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      'petit': 'Petit',
      'moyen': 'Moyen',
      'gros': 'Gros',
    };
    return <Badge variant="default">{typeMap[type] || type}</Badge>;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des colis</h1>
          <p className="text-gray-600 mt-1">Gérez les colis de votre compagnie</p>
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusActions.map((status) => {
          const count = parcels.filter(p => status.value === '' || p.status === status.value).length;
          const Icon = status.icon;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`p-4 bg-white rounded-xl border transition-all ${
                statusFilter === status.value ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`h-6 w-6 ${status.color} mb-2`} />
              <p className="text-2xl font-bold text-gray-900">
                {status.value === '' ? parcels.length : parcels.filter(p => p.status === status.value).length}
              </p>
              <p className="text-sm text-gray-500">{status.label}</p>
            </button>
          );
        })}
      </div>

      {parcels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun colis</h3>
            <p className="text-gray-600">
              {statusFilter ? 'Aucun colis avec ce statut' : 'Aucun colis pour le moment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <Card key={parcel._id}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Tracking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-lg font-bold text-primary-600">
                        {parcel.trackingNumber}
                      </span>
                      {getStatusBadge(parcel.status)}
                      {getParcelTypeBadge(parcel.type)}
                      <Badge variant={parcel.parcelMode === 'envoi' ? 'info' : 'warning'}>
                        {parcel.parcelMode === 'envoi' ? 'Envoi' : 'Récupération'}
                      </Badge>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{parcel.departure}</span>
                      <span>→</span>
                      <span className="font-medium">{parcel.arrival}</span>
                    </div>

                    {/* Sender/Receiver Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase mb-1">Expéditeur</p>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{parcel.sender.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{parcel.sender.phone}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase mb-1">Destinataire</p>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{parcel.receiver.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{parcel.receiver.phone}</span>
                        </div>
                      </div>
                    </div>

                    {parcel.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Description:</span> {parcel.description}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                      Créé le {formatDate(parcel.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="lg:text-right space-y-3">
                    {/* Status Update */}
                    {parcel.status !== 'livre' && parcel.status !== 'annule' && (
                      <div className="flex flex-wrap gap-2">
                        {parcel.status === 'en_attente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(parcel._id, 'collecte')}
                            isLoading={updatingId === parcel._id}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Collecter
                          </Button>
                        )}
                        {parcel.status === 'collecte' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(parcel._id, 'en_transit')}
                            isLoading={updatingId === parcel._id}
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            En transit
                          </Button>
                        )}
                        {parcel.status === 'en_transit' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(parcel._id, 'livre')}
                            isLoading={updatingId === parcel._id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marquer livré
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUpdateStatus(parcel._id, 'annule')}
                          isLoading={updatingId === parcel._id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
