'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParcelTracker from '@/components/features/ParcelTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Company, NIGER_CITIES, PARCEL_TYPE_LABELS } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Package, Send, CheckCircle, AlertCircle } from 'lucide-react';

const PARCEL_PRICES = { petit: 2000, moyen: 4000, gros: 7000 };

export default function ParcelPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'send' | 'track'>('send');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    companyId: '',
    type: 'petit' as 'petit' | 'moyen' | 'gros',
    description: '',
    departure: '',
    arrival: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies/active');
        setCompanies(response.data.data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();

    if (user) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.name,
        senderPhone: user.phone,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/parcels', {
        sender: { name: formData.senderName, phone: formData.senderPhone, address: formData.senderAddress },
        receiver: { name: formData.receiverName, phone: formData.receiverPhone, address: formData.receiverAddress },
        companyId: formData.companyId,
        type: formData.type,
        description: formData.description,
        departure: formData.departure,
        arrival: formData.arrival,
      });
      setTrackingNumber(response.data.data.trackingNumber);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  const cityOptions = [{ value: '', label: 'Sélectionner' }, ...NIGER_CITIES.map((c) => ({ value: c, label: c }))];
  const companyOptions = [{ value: '', label: 'Sélectionner une compagnie' }, ...companies.map((c) => ({ value: c._id, label: c.name }))];
  const typeOptions = Object.entries(PARCEL_TYPE_LABELS).map(([value, label]) => ({ value, label: `${label} - ${formatPrice(PARCEL_PRICES[value as keyof typeof PARCEL_PRICES])}` }));

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="max-w-lg mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Envoi enregistré !</h2>
                <p className="text-gray-600 mb-4">Votre numéro de suivi :</p>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-2xl font-mono font-bold text-primary-600">{trackingNumber}</p>
                </div>
                <Button onClick={() => router.push('/client/parcels')}>Voir mes colis</Button>
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
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Envoi de colis</h1>

          <div className="flex space-x-4 mb-6">
            <button onClick={() => setActiveTab('send')} className={`flex items-center px-4 py-2 rounded-lg font-medium ${activeTab === 'send' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}>
              <Send className="h-4 w-4 mr-2" />Envoyer
            </button>
            <button onClick={() => setActiveTab('track')} className={`flex items-center px-4 py-2 rounded-lg font-medium ${activeTab === 'track' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}>
              <Package className="h-4 w-4 mr-2" />Suivre
            </button>
          </div>

          {activeTab === 'track' ? (
            <ParcelTracker />
          ) : (
            <Card>
              <CardHeader><CardTitle>Nouveau colis</CardTitle></CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700">
                    <AlertCircle className="h-5 w-5" /><span>{error}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Expéditeur</h3>
                      <Input label="Nom" value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} required />
                      <Input label="Téléphone" value={formData.senderPhone} onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })} required />
                      <Input label="Adresse" value={formData.senderAddress} onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })} required />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Destinataire</h3>
                      <Input label="Nom" value={formData.receiverName} onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })} required />
                      <Input label="Téléphone" value={formData.receiverPhone} onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })} required />
                      <Input label="Adresse" value={formData.receiverAddress} onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })} required />
                    </div>
                  </div>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Départ" options={cityOptions} value={formData.departure} onChange={(e) => setFormData({ ...formData, departure: e.target.value })} required />
                    <Select label="Arrivée" options={cityOptions} value={formData.arrival} onChange={(e) => setFormData({ ...formData, arrival: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Compagnie" options={companyOptions} value={formData.companyId} onChange={(e) => setFormData({ ...formData, companyId: e.target.value })} required />
                    <Select label="Type de colis" options={typeOptions} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} required />
                  </div>
                  <Input label="Description (optionnel)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Contenu du colis..." />
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <span>Prix total</span>
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(PARCEL_PRICES[formData.type])}</span>
                  </div>
                  <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Envoyer le colis</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
