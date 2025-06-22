// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { cn } from '@/utils/helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('animate-spin', sizeClasses[size], className)}>
      <svg
        className="text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Page Loading Component
interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

// List Loading Component
interface ListLoadingProps {
  count?: number;
}

export const ListLoading: React.FC<ListLoadingProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

// Inline Loading Component
interface InlineLoadingProps {
  text?: string;
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  text = 'Loading...', 
  className 
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

// Button Loading State (for form submissions)
export const ButtonLoading: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" className="text-white" />
      <span>Please wait...</span>
    </div>
  );
};

// Full Screen Loading
interface FullScreenLoadingProps {
  message?: string;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({ 
  message = 'Loading LearnLoop...' 
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold">SS</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">LearnLoop</span>
      </div>
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  );
};

// Table Loading
export const TableLoading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 py-3 border-b">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 py-3">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress Loading (for file uploads, etc.)
interface ProgressLoadingProps {
  progress: number;
  message?: string;
}

export const ProgressLoading: React.FC<ProgressLoadingProps> = ({ 
  progress, 
  message = 'Uploading...' 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{message}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};