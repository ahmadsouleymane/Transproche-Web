'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  Package,
  Building2,
  Users,
  Settings,
  Route,
  DollarSign,
  Image as ImageIcon,
  LogOut,
  User,
  ClipboardList,
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const clientLinks: SidebarLink[] = [
  { href: '/client/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/client/bookings', label: 'Mes réservations', icon: Ticket },
  { href: '/client/parcels', label: 'Mes colis', icon: Package },
  { href: '/client/profile', label: 'Mon profil', icon: User },
];

const companyLinks: SidebarLink[] = [
  { href: '/company/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/company/reservations', label: 'Réservations', icon: Ticket },
  { href: '/company/trips', label: 'Trajets', icon: Route },
  { href: '/company/parcels', label: 'Colis', icon: Package },
  { href: '/company/manifest', label: 'Manifeste', icon: ClipboardList },
];

const adminLinks: SidebarLink[] = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/companies', label: 'Compagnies', icon: Building2 },
  { href: '/admin/commissions', label: 'Commissions', icon: DollarSign },
  { href: '/admin/ads', label: 'Publicités', icon: ImageIcon },
];

interface SidebarProps {
  role: 'client' | 'compagnie' | 'admin';
}

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = role === 'admin' ? adminLinks : role === 'compagnie' ? companyLinks : clientLinks;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Get company logo for company users
  const companyLogo = role === 'compagnie' && user?.company?.logo
    ? `${apiUrl}${user.company.logo}`
    : null;
  const companyName = role === 'compagnie' && user?.company?.name
    ? user.company.name
    : null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        {role === 'compagnie' && companyLogo ? (
          // Company view with logo
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={companyLogo}
                alt={companyName || 'Company logo'}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{companyName}</p>
              <p className="text-sm text-gray-500">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
          </div>
        ) : role === 'compagnie' && companyName ? (
          // Company view without logo
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{companyName}</p>
              <p className="text-sm text-gray-500">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
          </div>
        ) : (
          // Default view for client/admin
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
