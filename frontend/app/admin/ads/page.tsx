'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import { Advertisement } from '@/types';
import { Loader2, Image as ImageIcon, Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({ title: '', link: '', active: true, position: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const fetchAds = async () => {
    try {
      const response = await api.get('/advertisements');
      setAds(response.data.data?.advertisements || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('link', formData.link);
      data.append('active', String(formData.active));
      data.append('position', String(formData.position));
      if (imageFile) data.append('image', imageFile);

      if (editingAd) {
        await api.put(`/advertisements/${editingAd._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/advertisements', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setIsModalOpen(false);
      setEditingAd(null);
      setFormData({ title: '', link: '', active: true, position: 0 });
      setImageFile(null);
      fetchAds();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({ title: ad.title, link: ad.link || '', active: ad.active, position: ad.position });
    setIsModalOpen(true);
  };

  const handleDelete = async (adId: string) => {
    if (confirm('Supprimer cette publicité ?')) {
      await api.delete(`/advertisements/${adId}`);
      fetchAds();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Publicités</h1>
        <Button onClick={() => { setEditingAd(null); setFormData({ title: '', link: '', active: true, position: 0 }); setImageFile(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Nouvelle publicité
        </Button>
      </div>

      {ads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune publicité</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ads.map((ad) => (
            <Card key={ad._id}>
              <CardContent className="p-4">
                <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image src={`${apiUrl}${ad.image}`} alt={ad.title} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{ad.title}</p>
                    <Badge variant={ad.active ? 'success' : 'default'}>{ad.active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(ad._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAd ? 'Modifier la publicité' : 'Nouvelle publicité'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Lien (optionnel)" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
          <Input label="Position" type="number" value={formData.position} onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
            <label htmlFor="active" className="text-sm">Active</label>
          </div>
          <Button type="submit" className="w-full">{editingAd ? 'Modifier' : 'Créer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
