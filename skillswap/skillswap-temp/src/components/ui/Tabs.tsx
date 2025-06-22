// ==================== src/components/ui/Tabs.tsx ====================
import React from 'react';
import { cn } from '@/utils/helpers';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({ value: '', onValueChange: () => {} });

const Tabs: React.FC<TabsProps> = ({
  defaultValue = '',
  value,
  onValueChange,
  children,
  className
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-xl bg-neutral-100 p-1',
        className
      )}
    >
      {children}
    </div>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext);
  const isActive = currentValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-white text-neutral-900 shadow-soft'
          : 'text-neutral-600 hover:text-neutral-900',
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const { value: currentValue } = React.useContext(TabsContext);
  
  if (currentValue !== value) return null;

  return (
    <div className={cn('mt-4 animate-fade-in', className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };