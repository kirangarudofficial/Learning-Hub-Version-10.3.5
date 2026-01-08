import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { UserRole } from '../types/roles';
import { authApi, handleApiError } from '../services/api';
import { mockAuthApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [usesMockApi, setUsesMockApi] = useState(false);

  // Function to check if backend is available
  const checkBackendAvailability = async (): Promise<boolean> => {
    try {
      // Use AbortController for timeout (fetch doesn't support timeout property)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('http://localhost:3000/api/health', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('[Auth] Backend not available, using mock API');
      return false;
    }
  };

  // Get the appropriate API (real or mock)
  const getAuthApi = () => usesMockApi ? mockAuthApi : authApi;

  useEffect(() => {
    // Check backend availability and then check for existing session
    initializeAuth();

    // Listen for logout events from API client
    const handleLogout = () => {
      console.log('[Auth] Logout event received');
      setUser(null);
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const initializeAuth = async () => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      setUsesMockApi(!isBackendAvailable);
      await checkExistingSession();
    } catch (error) {
      console.error('[Auth] Failed to initialize auth:', error);
      setUsesMockApi(true);
      await checkExistingSession();
    }
  };

  const checkExistingSession = async () => {
    try {
      // Try to get user from localStorage first
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }

      // Verify token with server
      const api = getAuthApi();
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        const serverUser: User = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.avatar,
          role: response.data.role as UserRole,
          enrolledCourses: [],
          createdAt: new Date(response.data.createdAt),
        };

        setUser(serverUser);
        localStorage.setItem('user', JSON.stringify(serverUser));
      }
    } catch (error) {
      console.warn('[Auth] Session check failed:', handleApiError(error));
      // Clear invalid session data
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const api = getAuthApi();
      const response = await api.login(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      const { accessToken, user: userData } = response.data;

      const newUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        role: userData.role as UserRole,
        enrolledCourses: [],
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      console.log('[Auth] Login successful:', { user: newUser.email, role: newUser.role });
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw new Error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const api = getAuthApi();
      const response = await api.register(name, email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      const { accessToken, user: userData } = response.data;

      const newUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        role: userData.role as UserRole,
        enrolledCourses: [],
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      console.log('[Auth] Registration successful:', { user: newUser.email, role: newUser.role });
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      throw new Error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const api = getAuthApi();
      await api.logout();
    } catch (error) {
      console.warn('[Auth] Logout API call failed:', handleApiError(error));
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      console.log('[Auth] User logged out');
    }
  };

  const refreshUser = async () => {
    try {
      const api = getAuthApi();
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        const serverUser: User = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.avatar,
          role: response.data.role as UserRole,
          enrolledCourses: [],
          createdAt: new Date(response.data.createdAt),
        };

        setUser(serverUser);
        localStorage.setItem('user', JSON.stringify(serverUser));
      }
    } catch (error) {
      console.error('[Auth] Failed to refresh user:', handleApiError(error));
      // Don't logout on refresh failure, user might still be valid
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};