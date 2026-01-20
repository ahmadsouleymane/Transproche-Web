# TRANSPROCHE - Checklist de Mise en Production

## ✅ Tâches Complétées

### Sécurité Backend
- [x] Ajout de Helmet (headers de sécurité)
- [x] Ajout de compression gzip
- [x] Rate limiting global (100 req/15min en prod)
- [x] Rate limiting strict pour auth (10 req/15min en prod)
- [x] Logging avec Morgan
- [x] Graceful shutdown

### Infrastructure Docker
- [x] Dockerfile backend (multi-stage build)
- [x] Dockerfile frontend (multi-stage build)
- [x] docker-compose.yml (production)
- [x] docker-compose.dev.yml (développement)
- [x] .dockerignore pour backend et frontend

### Configuration Nginx
- [x] Configuration principale nginx.conf
- [x] Configuration serveur avec SSL
- [x] Rate limiting au niveau reverse proxy
- [x] Compression gzip
- [x] Headers de sécurité

### CI/CD
- [x] GitHub Actions workflow pour CI
- [x] Build test backend
- [x] Build test frontend
- [x] Build test Docker images

### Configuration
- [x] .env.production.example (backend)
- [x] .env.production.example (frontend)
- [x] next.config.ts optimisé pour production
- [x] Scripts de déploiement (deploy.sh)

---

## 📋 Tâches Restantes Avant Production

### 1. Configuration Serveur (Priorité Haute)
- [ ] **Louer un serveur VPS** (DigitalOcean, AWS EC2, Hetzner, OVH)
  - Minimum recommandé: 2 vCPU, 4GB RAM, 80GB SSD
  - OS: Ubuntu 22.04 LTS

- [ ] **Installer Docker et Docker Compose sur le serveur**
  ```bash
  # Sur le serveur Ubuntu
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo apt-get install docker-compose-plugin
  ```

- [ ] **Configurer le firewall**
  ```bash
  sudo ufw allow 22/tcp   # SSH
  sudo ufw allow 80/tcp   # HTTP
  sudo ufw allow 443/tcp  # HTTPS
  sudo ufw enable
  ```

### 2. Nom de Domaine et DNS (Priorité Haute)
- [ ] **Acheter un nom de domaine** (ex: transproche.com)
- [ ] **Configurer les enregistrements DNS**
  ```
  A     @              -> IP_DU_SERVEUR
  A     www            -> IP_DU_SERVEUR
  A     api            -> IP_DU_SERVEUR
  ```

### 3. Configuration Production (Priorité Haute)
- [ ] **Créer le fichier backend/.env.production**
  ```bash
  cp backend/.env.production.example backend/.env.production
  # Éditer avec vos vraies valeurs:
  # - MONGODB_URI (votre connexion MongoDB Atlas)
  # - JWT_SECRET (générer: openssl rand -base64 64)
  # - JWT_REFRESH_SECRET (générer: openssl rand -base64 64)
  # - CORS_ORIGIN (votre domaine: https://transproche.com)
  ```

- [ ] **Mettre à jour les domaines dans nginx/conf.d/default.conf**
  - Remplacer `transproche.com` par votre domaine

- [ ] **Mettre à jour les domaines dans frontend/next.config.ts**
  - Remplacer `transproche.com` par votre domaine

### 4. Certificats SSL (Priorité Haute)
- [ ] **Obtenir les certificats Let's Encrypt**
  ```bash
  # Sur le serveur, après avoir configuré DNS
  ./scripts/deploy.sh ssl
  ```

- [ ] **Activer SSL dans nginx/conf.d/default.conf**
  - Décommenter les lignes `ssl_certificate` et `ssl_certificate_key`

### 5. Base de Données (Priorité Haute)
- [ ] **Configurer MongoDB Atlas pour la production**
  - Créer un cluster dédié (M10 minimum recommandé)
  - Configurer la liste blanche IP (ou 0.0.0.0/0 pour VPS)
  - Créer un utilisateur avec accès limité
  - Activer les backups automatiques

### 6. Déploiement Initial
- [ ] **Cloner le repo sur le serveur**
  ```bash
  git clone https://github.com/devwithjustmaley/Transproche-Web.git
  cd Transproche-Web
  ```

- [ ] **Déployer**
  ```bash
  ./scripts/deploy.sh deploy
  ```

- [ ] **Vérifier que tout fonctionne**
  ```bash
  ./scripts/deploy.sh status
  ./scripts/deploy.sh logs backend
  ./scripts/deploy.sh logs frontend
  ```

---

## 📋 Tâches Optionnelles (Post-Production)

### Monitoring et Logging
- [ ] Configurer un service de monitoring (Uptime Robot, Pingdom)
- [ ] Ajouter Sentry pour le tracking d'erreurs
- [ ] Configurer des alertes email/Slack pour les erreurs critiques
- [ ] Mettre en place la rotation des logs

### Performance
- [ ] Configurer un CDN (Cloudflare) devant le site
- [ ] Optimiser les images (compression, formats modernes)
- [ ] Analyser les performances avec Lighthouse

### Sécurité Avancée
- [ ] Configurer fail2ban sur le serveur
- [ ] Activer les backups automatiques du serveur
- [ ] Configurer l'authentification 2FA pour MongoDB Atlas
- [ ] Audit de sécurité des dépendances (`npm audit`)

### Email
- [ ] Configurer un service d'envoi d'emails (SendGrid, Mailgun)
- [ ] Implémenter les emails de confirmation de réservation
- [ ] Implémenter les emails de notification

### Paiement
- [ ] Intégrer une solution de paiement mobile (Orange Money, Moov Money)
- [ ] Tester le flux de paiement en sandbox
- [ ] Passer en mode production

### SEO et Analytics
- [ ] Ajouter Google Analytics
- [ ] Configurer Google Search Console
- [ ] Ajouter les meta tags SEO
- [ ] Créer un sitemap.xml

### Mobile
- [ ] Tester l'installation PWA sur mobile
- [ ] Vérifier les icônes et splash screens
- [ ] Tester la notification push

---

## 🚀 Commandes Utiles

### Déploiement
```bash
# Déployer (build + start)
./scripts/deploy.sh deploy

# Redémarrer les services
./scripts/deploy.sh restart

# Voir les logs
./scripts/deploy.sh logs backend
./scripts/deploy.sh logs frontend
./scripts/deploy.sh logs nginx

# Arrêter les services
./scripts/deploy.sh stop

# Voir le statut
./scripts/deploy.sh status
```

### Mise à jour
```bash
# Sur le serveur
cd /chemin/vers/Transproche-Web
git pull origin main
./scripts/deploy.sh deploy
```

### Debug
```bash
# Entrer dans un container
docker exec -it transproche-backend sh
docker exec -it transproche-frontend sh

# Voir les logs en temps réel
docker compose logs -f

# Vérifier la santé
curl http://localhost:5000/health
```

---

## 📞 Support

Pour toute question sur le déploiement, consultez:
- Documentation Docker: https://docs.docker.com
- Documentation Next.js: https://nextjs.org/docs
- Documentation MongoDB Atlas: https://www.mongodb.com/docs/atlas

---

*Document généré automatiquement - Dernière mise à jour: Janvier 2026*
