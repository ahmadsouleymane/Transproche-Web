import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, '../../.env') });

import { User } from '../models/User';
import { Company } from '../models/Company';
import { Trip } from '../models/Trip';
import { TRANSPORT_COMPANIES } from '../config/cities';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transproche';

// Tarifs principaux (FCFA) - basés sur recherches 2024
const ROUTES_WITH_PRICES = {
  // Depuis Niamey
  'Niamey-Dosso': 3000,
  'Niamey-Tillabéri': 2000,
  'Niamey-Konni': 5500,
  'Niamey-Tahoua': 7000,
  'Niamey-Maradi': 8500,
  'Niamey-Zinder': 11000,
  'Niamey-Agadez': 18000,
  'Niamey-Arlit': 25000,
  'Niamey-Diffa': 20000,
  'Niamey-Gaya': 5000,
  'Niamey-Ouallam': 3000,
  'Niamey-Tera': 4000,
  // Retours vers Niamey
  'Dosso-Niamey': 3000,
  'Tillabéri-Niamey': 2000,
  'Konni-Niamey': 5500,
  'Tahoua-Niamey': 7000,
  'Maradi-Niamey': 8500,
  'Zinder-Niamey': 11000,
  'Agadez-Niamey': 18000,
  'Arlit-Niamey': 25000,
  'Diffa-Niamey': 20000,
  // Liaisons inter-régionales
  'Maradi-Zinder': 3500,
  'Zinder-Maradi': 3500,
  'Maradi-Tahoua': 5000,
  'Tahoua-Maradi': 5000,
  'Tahoua-Agadez': 12000,
  'Agadez-Tahoua': 12000,
  'Agadez-Arlit': 8000,
  'Arlit-Agadez': 8000,
  'Agadez-Zinder': 14000,
  'Zinder-Agadez': 14000,
  'Zinder-Diffa': 9000,
  'Diffa-Zinder': 9000,
  'Dosso-Gaya': 3000,
  'Gaya-Dosso': 3000,
  'Gaya-Niamey': 5000,
  'Ouallam-Niamey': 3000,
  'Tera-Niamey': 4000,
  // Destinations internationales
  'Niamey-Ouagadougou': 15000,
  'Niamey-Cotonou': 22000,
  'Niamey-Lomé': 28000,
  'Niamey-Abidjan': 45000,
  'Niamey-Accra': 35000,
  'Niamey-Bamako': 40000,
};

// Horaires de départ par compagnie (basés sur recherches réelles)
const COMPANY_SCHEDULES: Record<string, { times: string[]; routes: string[]; seats: number }> = {
  'Rimbo Transport Voyageur': {
    times: ['06:00', '08:00', '10:00', '14:00', '18:00'],
    routes: [
      'Niamey-Dosso', 'Niamey-Maradi', 'Niamey-Zinder', 'Niamey-Tahoua', 'Niamey-Agadez',
      'Niamey-Konni', 'Niamey-Diffa', 'Niamey-Cotonou', 'Niamey-Ouagadougou', 'Niamey-Lomé',
      'Maradi-Niamey', 'Zinder-Niamey', 'Maradi-Zinder', 'Zinder-Maradi',
      'Dosso-Niamey', 'Tahoua-Niamey', 'Agadez-Niamey',
    ],
    seats: 70,
  },
  'STM': {
    times: ['07:00', '09:00', '15:00', '19:00'],
    routes: [
      'Niamey-Agadez', 'Niamey-Zinder', 'Niamey-Tahoua', 'Niamey-Maradi',
      'Niamey-Ouagadougou', 'Niamey-Cotonou', 'Niamey-Lomé', 'Niamey-Abidjan',
      'Agadez-Niamey', 'Zinder-Niamey', 'Tahoua-Niamey', 'Maradi-Niamey',
      'Tahoua-Agadez', 'Agadez-Tahoua', 'Agadez-Arlit', 'Arlit-Agadez',
    ],
    seats: 55,
  },
  'Nizar Transport Voyageur': {
    times: ['06:30', '08:30', '12:00', '16:00', '20:00'],
    routes: [
      'Niamey-Maradi', 'Niamey-Zinder', 'Niamey-Dosso', 'Niamey-Tahoua',
      'Niamey-Konni', 'Niamey-Cotonou', 'Niamey-Ouagadougou',
      'Maradi-Niamey', 'Zinder-Niamey', 'Dosso-Niamey', 'Tahoua-Niamey',
      'Maradi-Zinder', 'Zinder-Maradi',
    ],
    seats: 60,
  },
  'Sonef Transport Voyageur': {
    times: ['05:30', '07:30', '11:00', '15:00', '18:30'],
    routes: [
      'Niamey-Maradi', 'Niamey-Zinder', 'Niamey-Tahoua', 'Niamey-Dosso',
      'Niamey-Ouagadougou', 'Niamey-Cotonou',
      'Maradi-Niamey', 'Zinder-Niamey', 'Tahoua-Niamey', 'Dosso-Niamey',
      'Maradi-Zinder', 'Zinder-Maradi', 'Maradi-Tahoua', 'Tahoua-Maradi',
    ],
    seats: 50,
  },
  'Ema Transport Voyageur': {
    times: ['06:00', '09:00', '14:00', '17:00'],
    routes: [
      'Niamey-Maradi', 'Niamey-Zinder', 'Niamey-Dosso', 'Niamey-Cotonou',
      'Maradi-Niamey', 'Zinder-Niamey', 'Dosso-Niamey',
      'Maradi-Zinder', 'Zinder-Maradi',
    ],
    seats: 50,
  },
  'Salim Transport Voyageur': {
    times: ['07:00', '10:00', '14:00', '18:00'],
    routes: [
      'Niamey-Maradi', 'Niamey-Zinder', 'Niamey-Tahoua', 'Niamey-Dosso',
      'Niamey-Konni', 'Niamey-Ouagadougou',
      'Maradi-Niamey', 'Zinder-Niamey', 'Tahoua-Niamey', 'Dosso-Niamey',
    ],
    seats: 55,
  },
  'Azawad Transport Voyageur': {
    times: ['06:00', '10:00', '16:00'],
    routes: [
      'Niamey-Tahoua', 'Niamey-Agadez', 'Niamey-Arlit', 'Niamey-Konni',
      'Tahoua-Niamey', 'Agadez-Niamey', 'Arlit-Niamey',
      'Tahoua-Agadez', 'Agadez-Tahoua', 'Agadez-Arlit', 'Arlit-Agadez',
    ],
    seats: 45,
  },
  'Africa Assalam': {
    times: ['06:30', '09:30', '14:30'],
    routes: [
      'Niamey-Tillabéri', 'Niamey-Ouallam', 'Niamey-Tera', 'Niamey-Dosso', 'Niamey-Gaya',
      'Tillabéri-Niamey', 'Ouallam-Niamey', 'Tera-Niamey', 'Dosso-Niamey', 'Gaya-Niamey',
      'Dosso-Gaya', 'Gaya-Dosso',
    ],
    seats: 40,
  },
  'Amana Transport VIP': {
    times: ['07:00', '11:00', '16:00', '20:00'],
    routes: [
      'Niamey-Maradi', 'Niamey-Zinder', 'Niamey-Tahoua', 'Niamey-Agadez',
      'Niamey-Ouagadougou', 'Niamey-Cotonou', 'Niamey-Lomé',
      'Maradi-Niamey', 'Zinder-Niamey', 'Tahoua-Niamey', 'Agadez-Niamey',
    ],
    seats: 35, // VIP - fewer seats
  },
};

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
    const companies: Map<string, any> = new Map();
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
      companies.set(companyData.name, company);
      console.log('Created company:', company.name);
    }

    // Create company users
    let i = 0;
    for (const [name, company] of companies) {
      await User.create({
        name: `Gestionnaire ${name}`,
        email: `gestionnaire${i + 1}@transproche.ne`,
        phone: `+227 91 00 00 0${i + 1}`,
        password: 'company123',
        role: 'compagnie',
        company: company._id,
      });
      i++;
    }
    console.log('Created company users');

    // Create trips for each company based on their schedules
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Every day
    let tripCount = 0;

    for (const [companyName, schedule] of Object.entries(COMPANY_SCHEDULES)) {
      const company = companies.get(companyName);
      if (!company) {
        console.log(`Company not found: ${companyName}`);
        continue;
      }

      for (const route of schedule.routes) {
        const [departure, arrival] = route.split('-');
        const price = ROUTES_WITH_PRICES[route as keyof typeof ROUTES_WITH_PRICES];

        if (!price) {
          console.log(`Price not found for route: ${route}`);
          continue;
        }

        // Create a trip for each departure time
        for (const time of schedule.times) {
          await Trip.create({
            company: company._id,
            departure,
            arrival,
            departureTime: time,
            price,
            availableSeats: schedule.seats,
            totalSeats: schedule.seats,
            daysOfWeek,
            status: 'active',
          });
          tripCount++;
        }
      }
      console.log(`Created trips for ${companyName}`);
    }

    console.log(`\nTotal trips created: ${tripCount}`);

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
    console.log(`\nTotal: ${companies.size} companies, ${tripCount} trips`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
