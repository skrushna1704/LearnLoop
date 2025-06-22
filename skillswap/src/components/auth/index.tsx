// src/components/auth/index.ts

// Auth Guards and Protection
export {
    ProtectedRoute,
    PublicRoute,
    RoleGuard,
    AuthStatus,
    InlineAuthGuard,
    AuthenticatedOnly,
    UnauthenticatedOnly,
    VerifiedOnly,
    CompleteProfileOnly,
    AdminOnly
  } from './AuthGaurds';
  
  // Re-export auth context and utilities
  export { AuthProvider, useAuth } from '@/context/AuthContext';
  export { default as AuthUtils } from '@/utils/auth';
  export type { User, AuthContextType, RegisterData } from '@/context/AuthContext';