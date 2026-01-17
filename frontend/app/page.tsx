import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TicketSearchForm from '@/components/features/TicketSearchForm';
import AdvertisementBanner from '@/components/features/AdvertisementBanner';
import CountryNotice from '@/components/features/CountryNotice';
import { Bus, Package, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: Bus,
      title: 'Réservation facile',
      description: 'Réservez vos billets de bus en quelques clics.',
    },
    {
      icon: Package,
      title: 'Envoi de colis',
      description: 'Envoyez vos colis partout au Niger en toute sécurité.',
    },
    {
      icon: Shield,
      title: 'Paiement à la livraison',
      description: 'Payez directement à la compagnie lors du voyage.',
    },
    {
      icon: Clock,
      title: 'Suivi en temps réel',
      description: 'Suivez vos réservations et colis en temps réel.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Voyagez à travers le Niger
              </h1>
              <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                Réservez vos billets de bus et envoyez vos colis en toute simplicité.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <TicketSearchForm />
            </div>
          </div>
        </section>

        {/* Advertisement Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdvertisementBanner />
        </section>

        {/* Country Notice */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CountryNotice />
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi TRANSPROCHE ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à voyager ?
              </h2>
              <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                Inscrivez-vous maintenant et réservez votre premier voyage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100"
                >
                  Rechercher un trajet
                </Link>
                <Link
                  href="/parcel"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10"
                >
                  Envoyer un colis
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
