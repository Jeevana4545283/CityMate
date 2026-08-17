import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (name: string, email: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<IUser>) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('citymate_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('citymate_token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await api.getMe();
        if (currentUser && currentUser.name) {
          setUser(currentUser);
          setToken(storedToken);
        } else {
          throw new Error('Invalid user session');
        }
      } catch (err) {
        console.warn('Auth initialization session invalid:', err);
        localStorage.removeItem('citymate_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (name: string, email: string) => {
    const res = await api.login(name, email);
    if (res.token) {
      localStorage.setItem('citymate_token', res.token);
      setToken(res.token);
    }
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    if (res.token) {
      localStorage.setItem('citymate_token', res.token);
      setToken(res.token);
    }
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('citymate_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<IUser>) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
