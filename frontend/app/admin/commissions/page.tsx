'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { Company } from '@/types';
import { Loader2, DollarSign, Save } from 'lucide-react';

export default function CommissionsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commissions, setCommissions] = useState<Record<string, number>>({});

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      const companiesData = response.data.data?.companies || [];
      setCompanies(companiesData);
      const initialCommissions: Record<string, number> = {};
      companiesData.forEach((c: Company) => { initialCommissions[c._id] = c.commission; });
      setCommissions(initialCommissions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSave = async (companyId: string) => {
    try {
      await api.patch(`/companies/${companyId}/commission`, { commission: commissions[companyId] });
      alert('Commission mise à jour');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des commissions</h1>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune compagnie</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <Card key={company._id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{company.name}</p>
                  <p className="text-sm text-gray-500">{company.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={commissions[company._id] || 0}
                      onChange={(e) => setCommissions({ ...commissions, [company._id]: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                  <Button size="sm" onClick={() => handleSave(company._id)}>
                    <Save className="h-4 w-4 mr-1" />Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
