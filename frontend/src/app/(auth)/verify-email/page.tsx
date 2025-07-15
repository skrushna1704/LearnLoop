// src/app/auth/verify-email/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Clock,
  Shield,
  RefreshCw,
  AlertCircle,
  Sparkles,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import MinimalLogo from '@/components/ui/MinimalLogo';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);



  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const verifyEmail = useCallback(async (verificationToken: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/${verificationToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await response.json();
      console.log('Email verified successfully:', data);
      setIsVerified(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. The link may be expired or invalid.');
    } finally {
      setIsVerifying(false);
    }
  }, [router]);

    // Auto-verify if token is present
    useEffect(() => {
      if (token) {
        verifyEmail(token);
      }
    }, [token, verifyEmail]);

  const handleResendEmail = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email || '' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend verification email');
      }

      console.log('Verification email resent successfully');
      
      // Start countdown
      setCountdown(60);
      setCanResend(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Verification in progress
  if (token && isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0ibTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mb-6">
              <MinimalLogo size="lg" showTagline={false} layout="vertical" />
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              Please wait while we verify your email address...
            </p>
            
            <div className="animate-pulse">
              <div className="h-2 bg-indigo-200 rounded-full w-full"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Verification successful
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0ibTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        {/* Celebration Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute top-32 right-16 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-24 left-16 w-5 h-5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        
        <div className="relative z-10 max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mb-6">
              <MinimalLogo size="lg" showTagline={false} layout="vertical" />
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified Successfully! 🎉
            </h2>
            
            <p className="text-gray-600 mb-8">
              Welcome to LearnLoop! Your account is now active and ready to use. 
              Let&apos;s start your learning journey!
            </p>

            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Go to Login
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Your email is verified! Please log in to continue.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Verification failed (if there was an error)
  if (token && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0ibTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mb-6">
              <MinimalLogo size="lg" showTagline={false} layout="vertical" />
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h2>
            
            <p className="text-gray-600 mb-8">
              {error}
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending || !canResend}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                {isResending ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {canResend ? 'Resend Verification' : `Resend in ${countdown}s`}
                  </>
                )}
              </Button>
              
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Default state - waiting for email verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0ibTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      {/* Floating Email Icons */}
      <div className="absolute top-10 left-10 w-8 h-8 text-indigo-300 animate-bounce">
        <Mail className="w-full h-full" />
      </div>
      <div className="absolute bottom-10 right-10 w-6 h-6 text-purple-300 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Mail className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6">
            <MinimalLogo size="lg" showTagline={false} layout="vertical" />
          </div>
          
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <Mail className="h-8 w-8 text-indigo-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We&apos;ve sent a verification link to your email address.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Email Display */}
          {email && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Verification email sent to:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-4 text-sm text-gray-600 mb-8">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Click the verification link in your email</span>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span>The link will expire in 24 hours</span>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span>Check your spam folder if you don&apos;t see it</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || !canResend}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Resending Email...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
                </>
              )}
            </Button>

            <div className="flex space-x-3">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
              
              <Link href="/dashboard" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Skip for Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{' '}
            <Link 
              href="/support" 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}