'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { Advertisement } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdvertisementBanner = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get('/advertisements/active');
        setAds(response.data.data || []);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const content = (
    <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden bg-gray-100">
      <Image
        src={`${apiUrl}${currentAd.image}`}
        alt={currentAd.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-lg font-semibold">{currentAd.title}</h3>
      </div>

      {ads.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex((prev) => (prev + 1) % ads.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 right-4 flex space-x-1">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (currentAd.link) {
    return (
      <Link href={currentAd.link} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
};

export default AdvertisementBanner;
