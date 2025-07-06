'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  text?: string;
}

export default function GoogleLoginButton({ 
  className = '', 
  variant = 'outline',
  size = 'default',
  text = 'Continue with Google'
}: GoogleLoginButtonProps) {
  const { googleLogin, isLoading } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        const buttonElement = document.getElementById('google-login-button');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await googleLogin(response.credential);
      toast.success('Successfully logged in with Google!');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google. Please try again.');
    }
  };

  const handleManualGoogleLogin = async () => {
    try {
      // Fallback method if Google Identity Services doesn't load
      const response = await fetch(`${apiUrl}/auth/google/url`);
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      toast.error('Failed to initiate Google login. Please try again.');
    }
  };

  return (
    <div className={className}>
      {/* Google Identity Services button */}
      <div id="google-login-button" className="w-full" />
      
      {/* Fallback button */}
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={isLoading}
        onClick={handleManualGoogleLogin}
        className="w-full mt-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Chrome className="h-5 w-5 mr-2" />
        {isLoading ? 'Signing in...' : text}
      </Button>
    </div>
  );
} 