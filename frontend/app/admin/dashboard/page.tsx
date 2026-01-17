'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Users, Building2, Ticket, Package, TrendingUp } from 'lucide-react';

interface DashboardStats {
  users: { total: number };
  companies: { total: number; active: number };
  tickets: { total: number; confirmed: number; pending: number };
  parcels: { total: number; delivered: number; inTransit: number };
  revenue: { tickets: number; parcels: number; total: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats/dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Utilisateurs', value: stats?.users.total || 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Compagnies', value: stats?.companies.active || 0, icon: Building2, color: 'bg-green-100 text-green-600' },
    { label: 'Réservations', value: stats?.tickets.total || 0, icon: Ticket, color: 'bg-primary-100 text-primary-600' },
    { label: 'Colis', value: stats?.parcels.total || 0, icon: Package, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Revenus</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Billets</p>
              <p className="text-2xl font-bold text-primary-600">{formatPrice(stats?.revenue.tickets || 0)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Colis</p>
              <p className="text-2xl font-bold text-primary-600">{formatPrice(stats?.revenue.parcels || 0)}</p>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-primary-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-primary-600">{formatPrice(stats?.revenue.total || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
