import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';

export const generateAccessToken = (userId: string, role: UserRole): string => {
  return jwt.sign(
    { userId, role } as JwtPayload,
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

export const generateRefreshToken = (userId: string, role: UserRole): string => {
  return jwt.sign(
    { userId, role } as JwtPayload,
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
};
