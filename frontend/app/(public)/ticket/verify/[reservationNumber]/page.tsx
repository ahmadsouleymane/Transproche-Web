'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, AlertCircle, Calendar, Clock, MapPin, Users, Building2, Phone, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

interface TicketData {
  _id: string;
  reservationNumber: string;
  status: string;
  travelDate: string;
  seats: number;
  totalPrice: number;
  passengerInfo: {
    name: string;
    phone: string;
  };
  company: {
    name: string;
    logo?: string;
    phone?: string;
  };
  trip: {
    departure: string;
    arrival: string;
    departureTime: string;
  };
}

interface VerificationResult {
  ticket: TicketData;
  isValid: boolean;
  validationMessage: string;
}

export default function TicketVerifyPage() {
  const params = useParams();
  const reservationNumber = params.reservationNumber as string;

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyTicket = async () => {
      try {
        const response = await api.get(`/tickets/verify/${reservationNumber}`);
        setResult(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ticket non trouvé');
      } finally {
        setIsLoading(false);
      }
    };

    if (reservationNumber) {
      verifyTicket();
    }
  }, [reservationNumber]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      'en_attente': { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      'paye_livraison': { label: 'Paiement à la livraison', color: 'text-blue-700', bgColor: 'bg-blue-100' },
      'confirme': { label: 'Confirmé', color: 'text-green-700', bgColor: 'bg-green-100' },
      'annule': { label: 'Annulé', color: 'text-red-700', bgColor: 'bg-red-100' },
      'expire': { label: 'Expiré', color: 'text-gray-700', bgColor: 'bg-gray-100' },
    };
    return statusMap[status] || { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Vérification du ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="flex justify-center mb-8">
            <Image
              src="/logo.jpeg"
              alt="Transproche"
              width={180}
              height={50}
              className="h-14 w-auto"
            />
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ticket non trouvé
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { ticket, isValid, validationMessage } = result;
  const statusInfo = getStatusInfo(ticket.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex justify-center mb-8">
          <Image
            src="/logo.jpeg"
            alt="Transproche"
            width={180}
            height={50}
            className="h-14 w-auto"
          />
        </Link>

        {/* Validation Status Banner */}
        <div className={`rounded-xl p-6 mb-6 ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-center mb-3">
            {isValid ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <h1 className={`text-2xl font-bold text-center ${isValid ? 'text-green-800' : 'text-red-800'}`}>
            {isValid ? 'TICKET VALIDE' : 'TICKET INVALIDE'}
          </h1>
          <p className={`text-center mt-2 ${isValid ? 'text-green-700' : 'text-red-700'}`}>
            {validationMessage}
          </p>
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-primary-100 text-sm">N° de réservation</p>
                <p className="text-xl font-bold tracking-wider">{ticket.reservationNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Route */}
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-500 mb-1">Départ</p>
                <p className="text-xl font-bold text-gray-900">{ticket.trip.departure}</p>
              </div>
              <div className="px-4">
                <div className="w-12 h-0.5 bg-primary-300 relative">
                  <div className="absolute -right-1 -top-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-primary-500" />
                </div>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm text-gray-500 mb-1">Arrivée</p>
                <p className="text-xl font-bold text-gray-900">{ticket.trip.arrival}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(ticket.travelDate)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Heure</p>
                  <p className="font-medium text-gray-900">{ticket.trip.departureTime}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Passager</p>
                  <p className="font-medium text-gray-900">{ticket.passengerInfo.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-900">{ticket.passengerInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Compagnie</p>
                  <p className="font-medium text-gray-900">{ticket.company.name}</p>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Nombre de places</p>
                  <p className="text-xl font-bold text-primary-600">{ticket.seats} place(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticket.reservationNumber}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Télécharger le ticket PDF
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
