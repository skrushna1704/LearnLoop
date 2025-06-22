'use client'
import React from 'react';
import { cn } from '@/utils/helpers';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ 
    children, 
    required = false, 
    className, 
    ...props 
  }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium text-gray-700',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label'; 