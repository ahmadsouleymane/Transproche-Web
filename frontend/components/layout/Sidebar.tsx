'use client';

import Link from 'next/link';
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
  Image,
  LogOut,
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
];

const companyLinks: SidebarLink[] = [
  { href: '/company/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/company/reservations', label: 'Réservations', icon: Ticket },
  { href: '/company/trips', label: 'Trajets', icon: Route },
];

const adminLinks: SidebarLink[] = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/companies', label: 'Compagnies', icon: Building2 },
  { href: '/admin/commissions', label: 'Commissions', icon: DollarSign },
  { href: '/admin/ads', label: 'Publicités', icon: Image },
];

interface SidebarProps {
  role: 'client' | 'compagnie' | 'admin';
}

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = role === 'admin' ? adminLinks : role === 'compagnie' ? companyLinks : clientLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>
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
