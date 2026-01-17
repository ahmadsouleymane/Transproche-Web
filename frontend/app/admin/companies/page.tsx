'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import { Company } from '@/types';
import { getStatusColor } from '@/lib/utils';
import { Loader2, Building2, Plus, Edit, Trash2 } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', description: '', status: 'pending' });

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data.data?.companies || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany._id}`, formData);
      } else {
        await api.post('/companies', formData);
      }
      setIsModalOpen(false);
      setEditingCompany(null);
      setFormData({ name: '', email: '', phone: '', address: '', description: '', status: 'pending' });
      fetchCompanies();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({ name: company.name, email: company.email, phone: company.phone, address: company.address, description: company.description || '', status: company.status });
    setIsModalOpen(true);
  };

  const handleDelete = async (companyId: string) => {
    if (confirm('Supprimer cette compagnie ?')) {
      await api.delete(`/companies/${companyId}`);
      fetchCompanies();
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compagnies</h1>
        <Button onClick={() => { setEditingCompany(null); setFormData({ name: '', email: '', phone: '', address: '', description: '', status: 'pending' }); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Nouvelle compagnie
        </Button>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune compagnie</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {companies.map((company) => (
            <Card key={company._id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{company.name}</p>
                    <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{company.email} - {company.phone}</p>
                </div>
                <div className="text-sm text-gray-600">{company.address}</div>
                <div className="text-sm">Commission: <span className="font-bold">{company.commission}%</span></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(company)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(company._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCompany ? 'Modifier la compagnie' : 'Nouvelle compagnie'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Téléphone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <Input label="Adresse" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          {editingCompany && (
            <Select label="Statut" options={statusOptions} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
          )}
          <Button type="submit" className="w-full">{editingCompany ? 'Modifier' : 'Créer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
