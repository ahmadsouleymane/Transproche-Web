'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Ticket, Package, Route, Users, Building2, Image, User, ClipboardList } from 'lucide-react';

interface MobileNavProps {
  role: 'client' | 'compagnie' | 'admin';
}

const MobileNav = ({ role }: MobileNavProps) => {
  const pathname = usePathname();

  const clientLinks = [
    { href: '/client/dashboard', label: 'Accueil', icon: LayoutDashboard },
    { href: '/client/bookings', label: 'Billets', icon: Ticket },
    { href: '/client/parcels', label: 'Colis', icon: Package },
    { href: '/client/profile', label: 'Profil', icon: User },
  ];

  const companyLinks = [
    { href: '/company/dashboard', label: 'Accueil', icon: LayoutDashboard },
    { href: '/company/reservations', label: 'Billets', icon: Ticket },
    { href: '/company/parcels', label: 'Colis', icon: Package },
    { href: '/company/manifest', label: 'Manifeste', icon: ClipboardList },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Accueil', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/companies', label: 'Compagnies', icon: Building2 },
    { href: '/admin/ads', label: 'Publicités', icon: Image },
  ];

  const links = role === 'admin' ? adminLinks : role === 'compagnie' ? companyLinks : clientLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
