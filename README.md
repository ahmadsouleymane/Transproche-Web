# TRANSPROCHE

Plateforme de réservation de billets de bus et d'envoi de colis pour le Niger.

## Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, PWA
- **Backend**: Node.js, Express.js, TypeScript, MongoDB/Mongoose
- **Auth**: JWT avec RBAC (Client, Compagnie, Admin)

## Installation

### Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

### Backend

```bash
cd backend
npm install

# Lancer le serveur de développement
npm run dev

# Peupler la base de données avec les données initiales
npm run seed
```

L'API sera disponible sur http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Compagnies de Transport

| Compagnie | Téléphone | Site Web |
|-----------|-----------|----------|
| Nizar Transport Voyageur | +227 77 04 56 00 | [nizartv.com](https://www.nizartv.com/) |
| Rimbo Transport Voyageur | +227 90 90 24 04 | [rimbortv.net](https://rimbortv.net/) |
| STM | +227 20 73 23 23 | [stmvoyageurs.com](https://stmvoyageurs.com/) |
| Sonef Transport Voyageur | +227 20 74 00 00 | [sonef.net](https://sonef.net/) |
| Ema Transport Voyageur | +227 92 92 85 15 | [ematransportvoyageur.com](https://ematransportvoyageur.com/) |
| Salim Transport Voyageur | +227 80 08 16 00 | [salimtv.com](https://salimtv.com/) |
| Azawad Transport Voyageur | +227 96 96 00 00 | - |
| Africa Assalam | +227 93 28 78 00 | - |
| Amana Transport VIP | +227 80 15 75 75 | [amanatransportvip.com](https://amanatransportvip.com/) |

## Villes Desservies

### Principales villes du Niger
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

### Autres villes du Niger
Abalak, Aderbissanat, Aguié, Ayerou, Badaguichiri, Bakin Birji, Doutchi, Galmi, Gaya, Gazaoua, Gouré, Guidan Roumdji, Guidiguir, Illela, Konni, Madaoua, Maïné Soroa, Malbaza, Mirriah, Ouallam, Tanout, Tchiro, Tera, Tessaoua, Tchadoua, Tsernaoua

### Destinations Internationales
Abidjan, Accra, Bamako, Bobo-Dioulasso, Cotonou, Dakar, Gao, Lomé, Ouagadougou, Parakou

## Comptes de Test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@transproche.ne | admin123 |
| Compagnie | gestionnaire1@transproche.ne | company123 |
| Client | client@test.ne | client123 |

## Fonctionnalités

### Public
- Recherche de trajets avec tarifs officiels
- Liste des compagnies de transport
- Suivi de colis par numéro de tracking

### Client
- Réservation de billets
- Envoi de colis
- Suivi des réservations et colis
- Paiement à la livraison

### Compagnie
- Gestion des trajets (CRUD)
- Gestion des réservations
- Mise à jour des statuts des billets et colis

### Admin
- Gestion des utilisateurs
- Gestion des compagnies
- Configuration des commissions
- Gestion des publicités
- Statistiques et revenus

## Tarifs

Les tarifs sont basés sur la grille tarifaire unifiée du Niger. Exemples:

| Trajet | Prix (FCFA) |
|--------|-------------|
| Niamey → Zinder | 10 000 |
| Niamey → Maradi | 8 500 |
| Niamey → Agadez | 25 000 |
| Niamey → Arlit | 33 500 |
| Niamey → Ouagadougou | 15 000 |
| Niamey → Abidjan | 65 000 |
| Agadez → Arlit | 11 000 |

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Trajets
- `GET /api/trips/search` - Recherche de trajets
- `GET /api/trips` - Liste des trajets
- `POST /api/trips` - Créer un trajet (Compagnie)

### Billets
- `POST /api/tickets` - Réserver un billet
- `GET /api/tickets` - Mes réservations
- `PATCH /api/tickets/:id/status` - Changer le statut

### Colis
- `POST /api/parcels` - Envoyer un colis
- `GET /api/parcels/track/:trackingNumber` - Suivre un colis
- `GET /api/parcels` - Mes colis

### Compagnies
- `GET /api/companies/active` - Compagnies actives

## Couleur principale

Orange dynamique (#ea580c) - inspiré du drapeau nigérien

## Licence

ISC
