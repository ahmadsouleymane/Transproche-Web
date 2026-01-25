'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AlertCircle, Ticket } from 'lucide-react';

function RegisterForm() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const returnUrl = searchParams.get('returnUrl');
  const isBookingFlow = returnUrl?.includes('/ticket/');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }, returnUrl || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image
            src="/logo.jpeg"
            alt="Transproche"
            width={180}
            height={50}
            className="h-14 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link
            href={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Connectez-vous
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Booking flow notice */}
        {isBookingFlow && (
          <div className="mb-4 mx-4 sm:mx-0 p-4 rounded-xl bg-primary-50 border border-primary-200 flex items-start space-x-3">
            <Ticket className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary-800">
                Créez un compte pour réserver
              </p>
              <p className="text-sm text-primary-700 mt-1">
                Inscrivez-vous rapidement pour finaliser votre réservation de billet.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10 border border-gray-200 mx-4 sm:mx-0">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              name="name"
              type="text"
              label="Nom complet"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />

            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+227 XX XX XX XX"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              placeholder="Au moins 6 caractères"
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer votre mot de passe"
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isBookingFlow ? 'S\'inscrire et réserver' : 'S\'inscrire'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
