import React from 'react';
import { MessageCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon}
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
      {description && <p className="text-gray-500 mb-4 max-w-md">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
