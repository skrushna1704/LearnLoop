// src/app/error.tsx
'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail, Bug } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  // Log error to monitoring service
  useEffect(() => {
    console.error('Application Error:', error);
    
    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // errorReportingService.captureException(error, {
    //   tags: { source: 'app-error-boundary' },
    //   extra: { digest: error.digest }
    // });
  }, [error]);

  // Determine error type and messaging
  const getErrorInfo = () => {
    const message = error.message.toLowerCase();
    
    // Network/API errors
    if (message.includes('fetch') || message.includes('network')) {
      return {
        title: 'Connection Problem',
        description: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
        type: 'network',
      };
    }
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('auth')) {
      return {
        title: 'Authentication Error',
        description: 'Your session may have expired. Please sign in again to continue.',
        type: 'auth',
      };
    }
    
    // Chunk loading errors (common in Next.js)
    if (message.includes('chunk') || message.includes('loading')) {
      return {
        title: 'Loading Error',
        description: 'There was a problem loading part of the application. This usually resolves with a refresh.',
        type: 'chunk',
      };
    }
    
    // Default error
    return {
      title: 'Something went wrong',
      description: 'We encountered an unexpected error. Our team has been notified and is working on a fix.',
      type: 'general',
    };
  };

  const errorInfo = getErrorInfo();

  // Enhanced retry function
  const handleRetry = () => {
    // For chunk errors, reload the page instead of just resetting
    if (errorInfo.type === 'chunk') {
      window.location.reload();
    } else {
      reset();
    }
  };

  // Report bug function
  const handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report: ${errorInfo.title}`);
    const body = encodeURIComponent(
      `I encountered an error on LearnLoop:\n\n` +
      `Error: ${error.message}\n` +
      `Page: ${window.location.href}\n` +
      `Time: ${new Date().toISOString()}\n` +
      `User Agent: ${navigator.userAgent}\n\n` +
      `Additional details:\n`
    );
    
    window.open(`mailto:support@LearnLoop.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - simplified for error state */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              {/* LearnLoop Logo SVG */}
              <div className="relative">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 100 100"
                  className="text-indigo-600"
                >
                  <circle
                    cx="50"
                    cy="30"
                    r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="70"
                    r="10"
                    fill="none"
                    stroke="#764ba2"
                    strokeWidth="3"
                  />
                  <path
                    d="M 50 52 Q 50 48 50 42"
                    stroke="#f093fb"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-20 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LearnLoop
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                  Learn by Teaching
                </span>
              </div>
            </Link>
          </div>                
            
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button> */}
          </div>
        </div>
      </header>

      {/* Main error content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          {/* Error icon */}
          <div className="mb-8">
            <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {errorInfo.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {errorInfo.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRetry} className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                {errorInfo.type === 'chunk' ? 'Reload Page' : 'Try Again'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Additional help options */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                Still having problems?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={handleReportBug}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Bug className="h-4 w-4 mr-1" />
                  Report this issue
                </button>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="mailto:support@LearnLoop.com"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contact support
                </a>
              </div>
            </div>
          </div>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                🔧 Development Error Details
              </summary>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-xs text-red-600 whitespace-pre-wrap overflow-auto">
                  <strong>Error:</strong> {error.name}
                  {'\n'}
                  <strong>Message:</strong> {error.message}
                  {'\n'}
                  <strong>Stack:</strong> {error.stack}
                  {error.digest && (
                    <>
                      {'\n'}
                      <strong>Digest:</strong> {error.digest}
                    </>
                  )}
                </pre>
              </div>
            </details>
          )}
        </div>
      </main>

      {/* Footer - simplified */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LearnLoop. We&apos;re working to fix this issue.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ErrorPage;