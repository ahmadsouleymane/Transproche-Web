import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TRANSPROCHE - Réservation de billets et envoi de colis',
    template: '%s | TRANSPROCHE',
  },
  description: 'Plateforme de réservation de billets de bus et d\'envoi de colis au Niger',
  keywords: ['transport', 'niger', 'bus', 'billet', 'colis', 'réservation'],
  authors: [{ name: 'TRANSPROCHE' }],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ea580c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
