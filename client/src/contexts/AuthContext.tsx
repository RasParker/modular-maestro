import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string, role: 'fan' | 'creator') => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@xclusive.com',
    username: 'admin',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'creator@example.com',
    username: 'amazingcreator',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'fan@example.com',
    username: 'loyalfan',
    role: 'fan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and verify with server
    const verifySession = async () => {
      const storedUser = localStorage.getItem('xclusive_user');
      if (storedUser) {
        try {
          // Verify session with server
          const response = await fetch('/api/auth/verify', {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Session expired or invalid, clear local storage
            console.log('Session expired, clearing local storage');
            localStorage.removeItem('xclusive_user');
            setUser(null);
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          // Clear local storage on error
          localStorage.removeItem('xclusive_user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Store user and token
      localStorage.setItem('xclusive_user', JSON.stringify(data.user));
      localStorage.setItem('xclusive_token', data.token);

      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, username: string, role: 'fan' | 'creator') => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username, role })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      const user = {
        ...data.user,
        id: data.user.id.toString() // Convert to string for compatibility
      };

      setUser(user);
      localStorage.setItem('xclusive_user', JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call server logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Server logout failed:', error);
    } finally {
      // Always clear client state
      setUser(null);
      localStorage.removeItem('xclusive_user');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('xclusive_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};