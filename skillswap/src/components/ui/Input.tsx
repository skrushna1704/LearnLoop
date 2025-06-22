// src/components/ui/Input.tsx
'use client';

import React from 'react';
import { cn } from '@/utils/helpers';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default',
    size = 'md',
    label, 
    error, 
    success,
    helperText, 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon,
    showPasswordToggle = false,
    type,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;
    const inputId = React.useId();

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    const variantClasses = {
      default: 'bg-white border border-gray-300',
      filled: 'bg-gray-50 border border-transparent',
    };

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'block w-full rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
              sizeClasses[size],
              variantClasses[variant],
              LeftIcon && 'pl-10',
              (RightIcon || (type === 'password' && showPasswordToggle)) && 'pr-10',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              success && 'border-green-300 focus:ring-green-500 focus:border-green-500',
              className
            )}
            {...props}
          />
          
          {/* Password toggle or right icon */}
          {(RightIcon || (type === 'password' && showPasswordToggle)) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {type === 'password' && showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              ) : RightIcon ? (
                <RightIcon className="h-5 w-5 text-gray-400" />
              ) : null}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };