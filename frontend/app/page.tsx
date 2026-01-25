import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TicketSearchForm from '@/components/features/TicketSearchForm';
import AdvertisementBanner from '@/components/features/AdvertisementBanner';
import NigerMap from '@/components/features/NigerMap';
import { Bus, Package, Shield, Clock, MapPin, Phone, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const companies = [
  {
    name: 'Rimbo Transport (RTV)',
    logo: '/companies/rimbo.png',
    description: 'La compagnie la plus rapide du Niger',
    routes: ['Niamey - Maradi', 'Niamey - Zinder', 'Niamey - Tahoua', 'International'],
    departureTime: '06:00 - 18:00',
    phone: '+227 20 73 23 23',
    color: 'bg-red-500',
  },
  {
    name: 'SNTV',
    logo: '/companies/sntv.png',
    description: 'Société Nigérienne de Transports de Voyageurs',
    routes: ['Niamey - Zinder', 'Niamey - Agadez - Arlit', 'Niamey - Diffa'],
    departureTime: '18:00',
    phone: '+227 20 73 30 29',
    color: 'bg-green-600',
  },
  {
    name: 'Air Transport',
    logo: '/companies/airtransport.png',
    description: 'Service quotidien vers toutes les régions',
    routes: ['Niamey - Maradi', 'Niamey - Zinder', 'Niamey - Diffa', 'International'],
    departureTime: '06:00 - 20:00',
    phone: '+227 20 73 45 67',
    color: 'bg-blue-600',
  },
  {
    name: 'STM Voyageurs',
    logo: '/companies/stm.png',
    description: 'Confort moderne avec climatisation',
    routes: ['Niamey - Agadez', 'Niamey - Tahoua', 'Niamey - Zinder'],
    departureTime: '07:00 - 19:00',
    phone: '+227 20 74 12 34',
    color: 'bg-purple-600',
  },
];

const popularRoutes = [
  { from: 'Niamey', to: 'Maradi', duration: '6h', departures: '5/jour' },
  { from: 'Niamey', to: 'Zinder', duration: '8h', departures: '4/jour' },
  { from: 'Niamey', to: 'Tahoua', duration: '5h', departures: '6/jour' },
  { from: 'Niamey', to: 'Agadez', duration: '11h', departures: '2/jour' },
  { from: 'Maradi', to: 'Zinder', duration: '2h', departures: '8/jour' },
  { from: 'Niamey', to: 'Dosso', duration: '2h', departures: '10/jour' },
];

const features = [
  {
    icon: Bus,
    title: 'Réservation facile',
    description: 'Réservez vos billets de bus en quelques clics, 24h/24.',
  },
  {
    icon: Package,
    title: 'Envoi & Récupération de colis',
    description: 'Envoyez et récupérez vos colis partout au Niger.',
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'Payez à la livraison directement à la compagnie.',
  },
  {
    icon: Clock,
    title: 'Suivi en temps réel',
    description: 'Suivez vos réservations et colis avec un numéro unique.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <Image
                  src="/logo.jpeg"
                  alt="Transproche"
                  width={280}
                  height={80}
                  className="h-20 md:h-24 w-auto bg-white rounded-xl p-2 shadow-lg"
                  priority
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Voyagez à travers le Niger
              </h1>
              <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                Réservez vos billets de bus, envoyez et récupérez vos colis en toute simplicité avec les meilleures compagnies du pays.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <TicketSearchForm />
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">4+</p>
                <p className="text-sm text-primary-100">Compagnies partenaires</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">8</p>
                <p className="text-sm text-primary-100">Régions desservies</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">50+</p>
                <p className="text-sm text-primary-100">Départs quotidiens</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-primary-100">Service disponible</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advertisement Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdvertisementBanner />
        </section>

        {/* Niger Map Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Réseau de transport au Niger</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez les principales lignes de transport reliant les grandes villes du Niger
              </p>
            </div>
            <NigerMap />
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos compagnies partenaires</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Voyagez avec les compagnies de transport les plus fiables du Niger
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companies.map((company) => (
                <div key={company.name} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 ${company.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Bus className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{company.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{company.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{company.routes.slice(0, 2).join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary-500" />
                      <span className="text-gray-600">Départs: {company.departureTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary-500" />
                      <span className="text-gray-600">{company.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/companies"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir toutes les compagnies
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trajets populaires</h2>
              <p className="text-gray-600">Les lignes les plus fréquentées au Niger</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularRoutes.map((route, index) => (
                <Link
                  key={index}
                  href={`/search?departure=${route.from}&arrival=${route.to}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{route.from}</span>
                      <ArrowRight className="h-4 w-4 text-primary-500" />
                      <span className="font-semibold text-gray-900">{route.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{route.duration}</span>
                    <span>{route.departures}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir TRANSPROCHE ?</h2>
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

        {/* How it works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Recherchez</h3>
                <p className="text-gray-600">Entrez votre ville de départ, d'arrivée et la date souhaitée</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Réservez</h3>
                <p className="text-gray-600">Choisissez votre compagnie et le nombre de places</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Voyagez</h3>
                <p className="text-gray-600">Présentez votre numéro de réservation et payez à l'agence</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full" />
              </div>
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Prêt à voyager ?
                </h2>
                <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                  Inscrivez-vous maintenant et réservez votre premier voyage avec TRANSPROCHE.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bus className="h-5 w-5 mr-2" />
                    Rechercher un trajet
                  </Link>
                  <Link
                    href="/parcel"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Envoyer un colis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
