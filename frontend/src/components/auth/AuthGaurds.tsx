// src/components/auth/AuthGuards.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner, FullScreenLoading } from '@/components/common';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import MinimalLogo from '@/components/ui/MinimalLogo';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  ArrowRight,
} from 'lucide-react';

// Types
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireEmailVerified?: boolean;
  requireProfileComplete?: boolean;
}

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

// =============================================================================
// PROTECTED ROUTE COMPONENT
// =============================================================================
export const ProtectedRoute: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  redirectTo = '/login',
  requireEmailVerified = false,
  requireProfileComplete = false
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Show loading while checking auth
  if (isLoading) {
    return fallback || <FullScreenLoading />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8 text-center max-w-md">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            Sign In
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  // Check email verification requirement
  if (requireEmailVerified && !user?.isEmailVerified) {
    return (
      <EmailVerificationRequired />
    );
  }

  // Check profile completion requirement
  if (requireProfileComplete && !user?.isProfileComplete) {
    return (
      <ProfileCompletionRequired />
    );
  }

  // User is authenticated and meets all requirements
  return <>{children}</>;
};

// =============================================================================
// PUBLIC ROUTE COMPONENT (redirects authenticated users)
// =============================================================================
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/dashboard'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if user needs to complete profile or verify email
      if (!user?.isEmailVerified) {
        router.push('/verify-email');
      } else if (!user?.isProfileComplete) {
        router.push('/setup-profile');
      } else {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user, redirectTo, router]);

  // Show loading while checking auth
  if (isLoading) {
    return <FullScreenLoading />;
  }

  // User is authenticated, they shouldn't see public routes
  if (isAuthenticated) {
    return <FullScreenLoading />;
  }

  // User is not authenticated, show public content
  return <>{children}</>;
};

// =============================================================================
// ROLE-BASED ACCESS GUARD
// =============================================================================
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const userRole = user?.role || 'user';
  if (!user || !allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <Lock className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600">
          You don&apos;t have permission to access this resource.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// =============================================================================
// AUTH STATUS COMPONENT
// =============================================================================
interface AuthStatusProps {
  showWhenAuthenticated?: ReactNode;
  showWhenUnauthenticated?: ReactNode;
  showWhenLoading?: ReactNode;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({
  showWhenAuthenticated,
  showWhenUnauthenticated,
  showWhenLoading
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{showWhenLoading || <LoadingSpinner size='sm' />}</>;
  }

  if (isAuthenticated) {
    return <>{showWhenAuthenticated}</>;
  }

  return <>{showWhenUnauthenticated}</>;
};

// =============================================================================
// VERIFICATION REQUIRED COMPONENTS
// =============================================================================
const EmailVerificationRequired: React.FC = () => {
  const { user, resendVerification } = useAuth();
  const router = useRouter();

  const handleResend = async () => {
    try {
      if (user?.email) {
        await resendVerification(user.email);
      }
    } catch (error) {
      console.error('Failed to resend verification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <MinimalLogo size="md" showTagline={false} layout="horizontal" />
        </div>

        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6">
            <Mail className="h-8 w-8 text-yellow-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            Please verify your email address to continue using LearnLoop.
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/verify-email')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Verify Email
            </Button>
            
            <Button
              onClick={handleResend}
              variant="outline"
              className="w-full"
            >
              Resend Verification Email
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ProfileCompletionRequired: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <MinimalLogo size="md" showTagline={false} layout="horizontal" />
        </div>

        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <User className="h-8 w-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h2>
          
          <p className="text-gray-600 mb-6">
            Please complete your profile setup to start using LearnLoop.
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/setup-profile')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Complete Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// =============================================================================
// INLINE AUTH GUARD (for protecting parts of components)
// =============================================================================
interface InlineAuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
  requireEmailVerified?: boolean;
  requireProfileComplete?: boolean;
  allowedRoles?: string[];
}

export const InlineAuthGuard: React.FC<InlineAuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true,
  requireEmailVerified = false,
  requireProfileComplete = false,
  allowedRoles
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <>{fallback || <LoadingSpinner size="sm" />}</>;
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback || null}</>;
  }

  if (requireEmailVerified && !user?.isEmailVerified) {
    return <>{fallback || null}</>;
  }

  if (requireProfileComplete && !user?.isProfileComplete) {
    return <>{fallback || null}</>;
  }

  if (allowedRoles) {
    const userRole = user?.role || 'user';
    if (!user || !allowedRoles.includes(userRole)) {
      return <>{fallback || null}</>;
    }
  }

  return <>{children}</>;
};

// =============================================================================
// QUICK AUTH COMPONENTS
// =============================================================================

// Show content only to authenticated users
export const AuthenticatedOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <InlineAuthGuard requireAuth={true} fallback={fallback}>
    {children}
  </InlineAuthGuard>
);

// Show content only to unauthenticated users
export const UnauthenticatedOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner size="sm" />;
  
  return isAuthenticated ? null : <>{children}</>;
};

// Show content only to verified users
export const VerifiedOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <InlineAuthGuard requireAuth={true} requireEmailVerified={true} fallback={fallback}>
    {children}
  </InlineAuthGuard>
);

// Show content only to users with complete profiles
export const CompleteProfileOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <InlineAuthGuard 
    requireAuth={true} 
    requireEmailVerified={true} 
    requireProfileComplete={true} 
    fallback={fallback}
  >
    {children}
  </InlineAuthGuard>
);

// Show content only to admin users
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <InlineAuthGuard requireAuth={true} allowedRoles={['admin']} fallback={fallback}>
    {children}
  </InlineAuthGuard>
);