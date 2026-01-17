# TRANSPROCHE

Plateforme de réservation de billets de bus et d'envoi de colis pour le Niger.

## Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, PWA
- **Backend**: Node.js, Express.js, TypeScript, MongoDB/Mongoose
- **Auth**: JWT avec RBAC (Client, Compagnie, Admin)

## Installation

### Prérequis

- Node.js 18+
- MongoDB
- npm ou yarn

### Backend

```bash
cd backend
npm install
npm run dev
```

L'API sera disponible sur http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Villes du Niger (prédéfinies)

- Niamey (capitale)
- Zinder
- Maradi
- Tahoua
- Agadez
- Dosso
- Diffa
- Tillabéri
- Arlit
- Birni N'Konni

## Fonctionnalités

### Public
- Recherche de trajets
- Liste des compagnies
- Suivi de colis

### Client
- Réservation de billets
- Envoi de colis
- Suivi des réservations et colis

### Compagnie
- Gestion des trajets
- Gestion des réservations
- Mise à jour des statuts

### Admin
- Gestion des utilisateurs
- Gestion des compagnies
- Configuration des commissions
- Gestion des publicités
- Statistiques

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil

### Trips
- `GET /api/trips/search` - Recherche
- `POST /api/trips` - Créer (Compagnie)

### Tickets
- `POST /api/tickets` - Réserver
- `GET /api/tickets` - Mes réservations

### Parcels
- `POST /api/parcels` - Envoyer
- `GET /api/parcels/track/:trackingNumber` - Suivi

## Couleur principale

Orange dynamique (#ea580c) - inspiré du drapeau nigérien
