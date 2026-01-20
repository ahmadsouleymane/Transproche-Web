import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';
import type { Secret, SignOptions } from 'jsonwebtoken';

// Forcer le type Secret pour TS
const JWT_SECRET: Secret = String(env.jwtSecret);
const JWT_REFRESH_SECRET: Secret = String(env.jwtRefreshSecret);

const ACCESS_OPTIONS: SignOptions = { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] };
const REFRESH_OPTIONS: SignOptions = { expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] };

export const generateAccessToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role } as JwtPayload, JWT_SECRET, ACCESS_OPTIONS);
};

export const generateRefreshToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role } as JwtPayload, JWT_REFRESH_SECRET, REFRESH_OPTIONS);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
