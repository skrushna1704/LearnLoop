// src/components/common/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // TODO: Send error to monitoring service
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={this.handleReset} className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <br />
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Error State Component for specific errors
interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showHomeLink?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  action,
  showHomeLink = true,
}) => {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{message}</p>
      
      <div className="space-y-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {showHomeLink && (
          <div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Network Error Component
interface NetworkErrorProps {
  onRetry?: () => void;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ onRetry }) => {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to our servers. Please check your internet connection and try again."
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
      showHomeLink={false}
    />
  );
};

// 404 Error Component
export const NotFoundError: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
        <br />
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

// Unauthorized Error Component
export const UnauthorizedError: React.FC = () => {
  return (
    <ErrorState
      title="Access Denied"
      message="You don't have permission to access this page. Please log in or contact support."
      action={{
        label: 'Sign In',
        onClick: () => window.location.href = '/login'
      }}
    />
  );
};

// Forbidden Error Component
export const ForbiddenError: React.FC = () => {
  return (
    <ErrorState
      title="Forbidden"
      message="You don't have the necessary permissions to view this content."
      showHomeLink={true}
    />
  );
};

// Server Error Component
export const ServerError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <ErrorState
      title="Server Error"
      message="Our servers are experiencing issues. Please try again in a few moments."
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
};

// Empty State Component (for when there's no data)
interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon: Icon,
}) => {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{message}</p>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};