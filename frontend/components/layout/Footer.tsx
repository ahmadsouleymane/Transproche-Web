import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image
              src="/logo.jpeg"
              alt="Transproche"
              width={160}
              height={45}
              className="h-12 w-auto bg-white rounded-lg p-1"
            />
            <p className="text-gray-400 text-sm">
              Votre plateforme de réservation de billets et d&apos;envoi de colis pour voyager à travers le Niger.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-primary-500 transition-colors">
                  Réservation de billets
                </Link>
              </li>
              <li>
                <Link href="/parcel" className="hover:text-primary-500 transition-colors">
                  Envoi de colis
                </Link>
              </li>
              <li>
                <Link href="/parcel" className="hover:text-primary-500 transition-colors">
                  Récupération de colis
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-primary-500 transition-colors">
                  Nos compagnies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>Niamey, Niger</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+227 90 00 00 00</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>contact@transproche.ne</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TRANSPROCHE. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-xs">
              Réservation • Récupération • Envoi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
