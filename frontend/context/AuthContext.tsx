'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      if (authApi.isAuthenticated()) {
        const userData = await authApi.getMe();
        setUser(userData);
      }
    } catch (error) {
      authApi.clearTokens();
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    authApi.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);

    // Redirect based on role
    switch (response.user.role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'compagnie':
        router.push('/company/dashboard');
        break;
      default:
        router.push('/client/dashboard');
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    const response = await authApi.register(data);
    authApi.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
    router.push('/client/dashboard');
  };

  const logout = () => {
    authApi.clearTokens();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
