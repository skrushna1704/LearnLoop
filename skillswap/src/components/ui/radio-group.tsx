'use client'
import React, { createContext, useContext } from 'react';
import { cn } from '@/utils/helpers';

interface RadioGroupContextType {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType>({});

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  value, 
  onValueChange, 
  children, 
  className, 
  ...props 
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div
        className={cn('space-y-2', className)}
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: string;
  description?: string;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ 
  value, 
  label, 
  description, 
  className, 
  ...props 
}) => {
  const { value: groupValue, onValueChange } = useContext(RadioGroupContext);
  const inputId = React.useId();

  return (
    <div className="flex items-center space-x-3">
      <input
        id={inputId}
        type="radio"
        value={value}
        checked={groupValue === value}
        onChange={() => onValueChange?.(value)}
        className={cn(
          'h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500',
          className
        )}
        {...props}
      />
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label 
              htmlFor={inputId}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}; 