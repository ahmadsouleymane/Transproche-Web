import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: true, // <-- autorise toutes les origines
  credentials: true, // pour les cookies ou JWT si nécessaire
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
