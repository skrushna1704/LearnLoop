// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

interface AvailabilitySlot {
  day: string;
  timeSlots: string[];
}

interface SkillReference {
  skillId: string; // Assuming ObjectId is stringified
  proficiency?: number;
  verified?: boolean;
  portfolio?: string[];
  experience?: string;
  description?: string;
  endorsements?: number;
  priority?: number;
  learning_goals?: string;
}

// Types - Aligned with backend IUser model
interface User {
  id: string; // Mongoose adds 'id' virtually
  email: string;
  isProfileComplete: boolean;
  profile?: {
    name?: string;
    profilePicture?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    website?: string;
    availability?: AvailabilitySlot[];
  };
  skills_offered?: SkillReference[];
  skills_needed?: SkillReference[];
  rating?: {
    average: number;
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  
  // Utils
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Real API call to validate token and get user
      const response = await fetch('http://localhost:5050/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // API returns user object directly
        setUser(data);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // 1. Set the auth token in local storage
        localStorage.setItem('authToken', result.token);
        
        // 2. Fetch the full user profile to ensure context is complete
        const profileResponse = await fetch('http://localhost:5050/api/profile', {
          headers: { 'Authorization': `Bearer ${result.token}` }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile after login.');
        }
        
        const loggedInUser = await profileResponse.json();
        setUser(loggedInUser);

        // 3. Redirect immediately and explicitly based on profile status
        if (loggedInUser.isProfileComplete) {
          router.push(routes.dashboard.root);
        } else {
          router.push(routes.dashboard.profile);
        }
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login function
  const googleLogin = async (token: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5050/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // 1. Set the auth token in local storage
        localStorage.setItem('authToken', result.token);
        
        // 2. Set user data directly from response
        setUser(result.user);

        // 3. Redirect based on profile status
        if (result.user.isProfileComplete) {
          router.push(routes.dashboard.root);
        } else {
          router.push(routes.dashboard.profile);
        }
      } else {
        throw new Error(result.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5050/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        // After successful registration, redirect to the login page
        router.push(routes.auth.login);
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear user state
      setUser(null);
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch('http://localhost:5050/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5050/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch('http://localhost:5050/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(prevUser => prevUser ? { ...prevUser, ...result.user } : null);
      } else {
        throw new Error(result.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        // Silently fail if no refresh token is present
        return;
      }

      const response = await fetch('http://localhost:5050/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const result = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', result.token);
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }
      } else {
        // If refresh fails, log the user out
        await logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    googleLogin,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    checkAuth,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export type { User, AuthContextType, RegisterData };