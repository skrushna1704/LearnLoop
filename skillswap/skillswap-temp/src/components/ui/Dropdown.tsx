// ==================== src/components/ui/Dropdown.tsx ====================
import React from 'react';
import { cn } from '@/utils/helpers';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute top-full z-50 mt-2 min-w-48 animate-fade-in-down rounded-xl border border-neutral-200 bg-white py-2 shadow-large',
            alignmentClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50',
        className
      )}
    >
      {children}
    </div>
  );
};

export { Dropdown, DropdownItem };
