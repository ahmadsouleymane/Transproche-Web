'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import { Company } from '@/types';
import { getStatusColor } from '@/lib/utils';
import { Loader2, Building2, Plus, Edit, Trash2, Upload, CheckCircle, X } from 'lucide-react';
import Image from 'next/image';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', description: '', status: 'pending' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('name', formData.name);
      formDataPayload.append('email', formData.email);
      formDataPayload.append('phone', formData.phone);
      formDataPayload.append('address', formData.address);
      formDataPayload.append('description', formData.description);
      if (editingCompany) {
        formDataPayload.append('status', formData.status);
      }
      if (logoFile) {
        formDataPayload.append('logo', logoFile);
      }

      if (editingCompany) {
        await api.put(`/companies/${editingCompany._id}`, formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/companies', formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setIsModalOpen(false);
      setEditingCompany(null);
      setFormData({ name: '', email: '', phone: '', address: '', description: '', status: 'pending' });
      setLogoFile(null);
      setLogoPreview(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({ name: company.name, email: company.email, phone: company.phone, address: company.address, description: company.description || '', status: company.status });
    setLogoPreview(company.logo ? `${apiUrl}${company.logo}` : null);
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (companyId: string) => {
    if (confirm('Supprimer cette compagnie ?')) {
      await api.delete(`/companies/${companyId}`);
      fetchCompanies();
    }
  };

  const openNewModal = () => {
    setEditingCompany(null);
    setFormData({ name: '', email: '', phone: '', address: '', description: '', status: 'pending' });
    setLogoFile(null);
    setLogoPreview(null);
    setIsModalOpen(true);
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
        <Button onClick={openNewModal}>
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
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <Image
                        src={`${apiUrl}${company.logo}`}
                        alt={company.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{company.name}</p>
                      <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{company.email} - {company.phone}</p>
                  </div>
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
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo de la compagnie</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            {logoPreview ? (
              <div className="relative w-24 h-24 mx-auto">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Cliquez pour ajouter un logo</span>
              </button>
            )}
          </div>

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
