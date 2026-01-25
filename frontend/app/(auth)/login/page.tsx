'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AlertCircle, Ticket } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const returnUrl = searchParams.get('returnUrl');
  const isBookingFlow = returnUrl?.includes('/ticket/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, returnUrl || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
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
          Connexion
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link
            href={returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register'}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Inscrivez-vous
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
                Connectez-vous pour réserver
              </p>
              <p className="text-sm text-primary-700 mt-1">
                Vous devez être connecté pour finaliser votre réservation de billet.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />

            <Input
              id="password"
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isBookingFlow ? 'Se connecter et réserver' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
