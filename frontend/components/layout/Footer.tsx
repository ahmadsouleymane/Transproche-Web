import Link from 'next/link';
import { Bus, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">TRANSPROCHE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Plateforme de réservation de billets et d&apos;envoi de colis pour le Niger.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-primary-500">
                  Rechercher un trajet
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-primary-500">
                  Compagnies
                </Link>
              </li>
              <li>
                <Link href="/parcel" className="hover:text-primary-500">
                  Envoyer un colis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Aide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Niamey, Niger</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+227 XX XX XX XX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@transproche.ne</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TRANSPROCHE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
