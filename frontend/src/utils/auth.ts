// src/utils/auth.ts

import { User } from '@/context/AuthContext';

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

export const TokenManager = {
  // Get auth token from localStorage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  // Set auth token in localStorage
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  },

  // Get refresh token from localStorage
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  // Set refresh token in localStorage
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
  },

  // Remove all tokens
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  // Check if token exists and is not expired
  isTokenValid: (token?: string): boolean => {
    const authToken = token || TokenManager.getToken();
    if (!authToken) return false;

    try {
      // Decode JWT token (basic check - in real app use proper JWT library)
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
};

// =============================================================================
// USER HELPERS
// =============================================================================

export const UserHelpers = {
  // Get user's full name
  getFullName: (user: User | null): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  },

  // Get user's initials for avatar
  getInitials: (user: User | null): string => {
    if (!user) return 'U';
    const firstName = user.firstName.charAt(0).toUpperCase();
    const lastName = user.lastName.charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  },

  // Check if user has completed onboarding
  isOnboardingComplete: (user: User | null): boolean => {
    if (!user) return false;
    return user.isEmailVerified && user.isProfileComplete && user.skills.length > 0;
  },

  // Get user's status badge
  getStatusBadge: (user: User | null): { text: string; color: string; bgColor: string } => {
    if (!user) {
      return { text: 'Guest', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }

    if (!user.isEmailVerified) {
      return { text: 'Unverified', color: 'text-red-600', bgColor: 'bg-red-100' };
    }

    if (!user.isProfileComplete) {
      return { text: 'Incomplete', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }

    return { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' };
  },

  // Format user's last active time
  formatLastActive: (user: User | null): string => {
    if (!user?.lastActive) return 'Never';

    const lastActive = new Date(user.lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return lastActive.toLocaleDateString();
  },

  // Check if user can teach a skill
  canTeachSkill: (user: User | null, skill: string): boolean => {
    if (!user) return false;
    return user.skills.includes(skill);
  },

  // Check if user is interested in learning a skill
  wantsToLearnSkill: (user: User | null, skill: string): boolean => {
    if (!user) return false;
    return user.interests.includes(skill);
  }
};

// =============================================================================
// PERMISSION HELPERS
// =============================================================================

export const PermissionHelpers = {
  // Check if user has specific role
  hasRole: (user: User | null, role: string): boolean => {
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: (user: User | null): boolean => {
    return PermissionHelpers.hasRole(user, 'admin');
  },

  // Check if user can access admin features
  canAccessAdmin: (user: User | null): boolean => {
    return PermissionHelpers.isAdmin(user) && UserHelpers.isOnboardingComplete(user);
  },

  // Check if user can create/edit content
  canModifyContent: (user: User | null, contentUserId?: string): boolean => {
    if (!user) return false;
    
    // Admins can modify any content
    if (PermissionHelpers.isAdmin(user)) return true;
    
    // Users can modify their own content
    return contentUserId ? user.id === contentUserId : true;
  },

  // Check if user can message another user
  canMessage: (user: User | null, targetUser: User | null): boolean => {
    if (!user || !targetUser) return false;
    if (user.id === targetUser.id) return false; // Can't message self
    
    return UserHelpers.isOnboardingComplete(user) && UserHelpers.isOnboardingComplete(targetUser);
  },

  // Check if user can book a session
  canBookSession: (user: User | null): boolean => {
    if (!user) return false;
    return UserHelpers.isOnboardingComplete(user);
  }
};

// =============================================================================
// ROUTE HELPERS
// =============================================================================

export const RouteHelpers = {
  // Get redirect URL after login based on user state
  getPostLoginRedirect: (user: User | null): string => {
    if (!user) return '/auth/login';
    
    if (!user.isEmailVerified) return '/verify-email';
    if (!user.isProfileComplete) return '/auth/setup-profile';
    
    return '/dashboard';
  },

  // Check if route requires authentication
  requiresAuth: (pathname: string): boolean => {
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/skills',
      '/exchanges',
      '/messages',
      '/schedule',
      '/settings'
    ];
    
    return protectedRoutes.some(route => pathname.startsWith(route));
  },

  // Check if route is public (should redirect authenticated users)
  isPublicRoute: (pathname: string): boolean => {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password'
    ];
    
    return publicRoutes.includes(pathname);
  },

  // Check if route requires email verification
  requiresEmailVerification: (pathname: string): boolean => {
    const verificationRequiredRoutes = [
      '/dashboard',
      '/skills',
      '/exchanges',
      '/messages'
    ];
    
    return verificationRequiredRoutes.some(route => pathname.startsWith(route));
  },

  // Get appropriate redirect for unauthenticated users
  getUnauthenticatedRedirect: (pathname: string): string => {
    // Store intended destination for after login
    const params = new URLSearchParams();
    if (pathname && pathname !== '/') {
      params.set('redirect', pathname);
    }
    
    return `/auth/login${params.toString() ? `?${params.toString()}` : ''}`;
  }
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export const ValidationHelpers = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password: string): {
    isValid: boolean;
    strength: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let strength = 0;

    if (password.length >= 8) {
      strength++;
    } else {
      feedback.push('At least 8 characters long');
    }

    if (/[A-Z]/.test(password)) {
      strength++;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/[a-z]/.test(password)) {
      strength++;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[0-9]/.test(password)) {
      strength++;
    } else {
      feedback.push('Include numbers');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      strength++;
    } else {
      feedback.push('Include special characters');
    }

    return {
      isValid: strength >= 3,
      strength,
      feedback
    };
  },

  // Check if passwords match
  passwordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  }
};

// =============================================================================
// ERROR HELPERS
// =============================================================================

export const ErrorHelpers = {
  // Get user-friendly error message
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    
    // Common error mappings
    const errorMappings: Record<string, string> = {
      'network_error': 'Network error. Please check your connection.',
      'invalid_credentials': 'Invalid email or password.',
      'email_already_exists': 'An account with this email already exists.',
      'user_not_found': 'No account found with this email.',
      'invalid_token': 'Invalid or expired token.',
      'email_not_verified': 'Please verify your email address.',
      'profile_incomplete': 'Please complete your profile.',
      'unauthorized': 'You are not authorized to perform this action.',
      'forbidden': 'Access denied.',
      'rate_limited': 'Too many requests. Please try again later.'
    };

    return errorMappings[error?.code] || 'An unexpected error occurred.';
  },

  // Check if error requires reauthentication
  requiresReauth: (error: any): boolean => {
    const reAuthCodes = ['invalid_token', 'token_expired', 'unauthorized'];
    return reAuthCodes.includes(error?.code);
  }
};

// =============================================================================
// STORAGE HELPERS
// =============================================================================

export const StorageHelpers = {
  // Store user data locally (for offline support)
  storeUserData: (user: User): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to store user data:', error);
    }
  },

  // Get stored user data
  getStoredUserData: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get stored user data:', error);
      return null;
    }
  },

  // Clear stored user data
  clearStoredUserData: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('userData');
    } catch (error) {
      console.warn('Failed to clear stored user data:', error);
    }
  },

  // Store app preferences
  storePreferences: (preferences: Record<string, any>): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('appPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to store preferences:', error);
    }
  },

  // Get stored preferences
  getStoredPreferences: (): Record<string, any> => {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem('appPreferences');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('Failed to get stored preferences:', error);
      return {};
    }
  }
};

// =============================================================================
// EXPORT ALL UTILITIES
// =============================================================================

export const AuthUtils = {
  TokenManager,
  UserHelpers,
  PermissionHelpers,
  RouteHelpers,
  ValidationHelpers,
  ErrorHelpers,
  StorageHelpers
};

export default AuthUtils;