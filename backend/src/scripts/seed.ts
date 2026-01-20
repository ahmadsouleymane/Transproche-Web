import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, '../../.env') });

import { User } from '../models/User';
import { Company } from '../models/Company';
import { Trip } from '../models/Trip';
import { TRANSPORT_COMPANIES } from '../config/cities';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transproche';

// Tarifs principaux extraits du fichier Excel
const MAIN_ROUTES = [
  // Depuis Niamey
  { departure: 'Niamey', arrival: 'Zinder', price: 10000 },
  { departure: 'Niamey', arrival: 'Maradi', price: 8500 },
  { departure: 'Niamey', arrival: 'Tahoua', price: 7000 },
  { departure: 'Niamey', arrival: 'Agadez', price: 25000 },
  { departure: 'Niamey', arrival: 'Dosso', price: 2500 },
  { departure: 'Niamey', arrival: 'Diffa', price: 18500 },
  { departure: 'Niamey', arrival: 'Arlit', price: 33500 },
  { departure: 'Niamey', arrival: 'Konni', price: 5000 },
  { departure: 'Niamey', arrival: 'Gaya', price: 5000 },
  { departure: 'Niamey', arrival: 'Tillabéri', price: 1500 },
  { departure: 'Niamey', arrival: 'Tera', price: 3500 },
  { departure: 'Niamey', arrival: 'Ouallam', price: 3000 },
  // Depuis Agadez
  { departure: 'Agadez', arrival: 'Niamey', price: 25000 },
  { departure: 'Agadez', arrival: 'Zinder', price: 13500 },
  { departure: 'Agadez', arrival: 'Arlit', price: 11000 },
  { departure: 'Agadez', arrival: 'Tahoua', price: 15500 },
  { departure: 'Agadez', arrival: 'Maradi', price: 18500 },
  { departure: 'Agadez', arrival: 'Diffa', price: 23000 },
  // Depuis Zinder
  { departure: 'Zinder', arrival: 'Niamey', price: 10000 },
  { departure: 'Zinder', arrival: 'Maradi', price: 3000 },
  { departure: 'Zinder', arrival: 'Agadez', price: 13500 },
  { departure: 'Zinder', arrival: 'Diffa', price: 8500 },
  { departure: 'Zinder', arrival: 'Tahoua', price: 7500 },
  // Depuis Maradi
  { departure: 'Maradi', arrival: 'Niamey', price: 8500 },
  { departure: 'Maradi', arrival: 'Zinder', price: 3000 },
  { departure: 'Maradi', arrival: 'Tahoua', price: 4500 },
  { departure: 'Maradi', arrival: 'Agadez', price: 18500 },
  // Depuis Tahoua
  { departure: 'Tahoua', arrival: 'Niamey', price: 7000 },
  { departure: 'Tahoua', arrival: 'Agadez', price: 15500 },
  { departure: 'Tahoua', arrival: 'Arlit', price: 23500 },
  { departure: 'Tahoua', arrival: 'Maradi', price: 4500 },
  // Destinations internationales
  { departure: 'Niamey', arrival: 'Ouagadougou', price: 15000 },
  { departure: 'Niamey', arrival: 'Cotonou', price: 20000 },
  { departure: 'Niamey', arrival: 'Lomé', price: 25000 },
  { departure: 'Niamey', arrival: 'Abidjan', price: 65000 },
  { departure: 'Niamey', arrival: 'Accra', price: 38000 },
  { departure: 'Niamey', arrival: 'Bamako', price: 55000 },
  { departure: 'Agadez', arrival: 'Ouagadougou', price: 52000 },
  { departure: 'Agadez', arrival: 'Abidjan', price: 80000 },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await Trip.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin Transproche',
      email: 'admin@transproche.ne',
      phone: '+227 90 00 00 00',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin user:', admin.email);

    // Create companies with real information
    const companies = [];
    for (const companyData of TRANSPORT_COMPANIES) {
      const company = await Company.create({
        name: companyData.name,
        phone: companyData.phone,
        email: companyData.email,
        address: companyData.address,
        website: companyData.website || null,
        logo: companyData.logo || null,
        description: companyData.description || null,
        status: 'active',
        commission: 10,
      });
      companies.push(company);
      console.log('Created company:', company.name);
    }

    // Create company users
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      await User.create({
        name: `Gestionnaire ${company.name}`,
        email: `gestionnaire${i + 1}@transproche.ne`,
        phone: `+227 91 00 00 0${i + 1}`,
        password: 'company123',
        role: 'compagnie',
        company: company._id,
      });
    }
    console.log('Created company users');

    // Create trips for each company
    const departureTimes = ['06:00', '07:00', '08:00', '09:00', '10:00', '14:00', '16:00'];
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Every day

    for (const company of companies) {
      for (const route of MAIN_ROUTES) {
        // Each company offers each route at different times
        const randomTime = departureTimes[Math.floor(Math.random() * departureTimes.length)];

        await Trip.create({
          company: company._id,
          departure: route.departure,
          arrival: route.arrival,
          departureTime: randomTime,
          price: route.price,
          availableSeats: 50,
          totalSeats: 50,
          daysOfWeek: daysOfWeek,
          status: 'active',
        });
      }
    }
    console.log(`Created ${MAIN_ROUTES.length * companies.length} trips`);

    // Create a test client user
    await User.create({
      name: 'Client Test',
      email: 'client@test.ne',
      phone: '+227 92 00 00 01',
      password: 'client123',
      role: 'client',
    });
    console.log('Created test client user');

    console.log('\n=== Seed completed successfully ===');
    console.log('\nTest accounts:');
    console.log('- Admin: admin@transproche.ne / admin123');
    console.log('- Company: gestionnaire1@transproche.ne / company123');
    console.log('- Client: client@test.ne / client123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
