// src/components/ui/MinimalLogo.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface MinimalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

const MinimalLogo: React.FC<MinimalLogoProps> = ({ 
  size = 'md', 
  showTagline = true,
  className = '',
  layout = 'horizontal'
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { 
      logo: 20, 
      text: 'text-lg', 
      tagline: 'text-xs',
      spacing: layout === 'vertical' ? 'space-y-1' : 'space-x-2'
    },
    md: { 
      logo: 32, 
      text: 'text-2xl', 
      tagline: 'text-sm',
      spacing: layout === 'vertical' ? 'space-y-2' : 'space-x-3'
    },
    lg: { 
      logo: 48, 
      text: 'text-4xl', 
      tagline: 'text-lg',
      spacing: layout === 'vertical' ? 'space-y-3' : 'space-x-4'
    }
  };

  const config = sizeConfig[size];

  if (layout === 'vertical') {
    return (
      <Link href="/" className={`flex flex-col items-center ${config.spacing} group ${className}`}>
        {/* Simple Loop Icon */}
        <div className="relative transition-transform duration-300 group-hover:scale-110">
          <svg 
            width={config.logo} 
            height={config.logo} 
            viewBox="0 0 100 100" 
            className="transition-colors duration-300"
          >
            {/* Simple connected loops */}
            <circle 
              cx="50" 
              cy="35" 
              r="15" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle 
              cx="50" 
              cy="65" 
              r="10" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path 
              d="M 50 50 L 50 55" 
              stroke="url(#gradient)" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#667eea'}} />
                <stop offset="50%" style={{stopColor:'#764ba2'}} />
                <stop offset="100%" style={{stopColor:'#f093fb'}} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h1 className={`${config.text} font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300`}>
            LearnLoop
          </h1>
          {showTagline && (
            <p className={`${config.tagline} text-gray-600 group-hover:text-gray-500 transition-colors duration-300`}>
              Learn by Teaching • Teach by Learning
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center ${config.spacing} group ${className}`}>
      {/* Simple Loop Icon */}
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        <svg 
          width={config.logo} 
          height={config.logo} 
          viewBox="0 0 100 100" 
          className="transition-colors duration-300"
        >
          {/* Simple connected loops */}
          <circle 
            cx="50" 
            cy="35" 
            r="15" 
            fill="none" 
            stroke="url(#gradient-h)" 
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle 
            cx="50" 
            cy="65" 
            r="10" 
            fill="none" 
            stroke="url(#gradient-h)" 
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path 
            d="M 50 50 L 50 55" 
            stroke="url(#gradient-h)" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient-h" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#667eea'}} />
              <stop offset="50%" style={{stopColor:'#764ba2'}} />
              <stop offset="100%" style={{stopColor:'#f093fb'}} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <h1 className={`${config.text} font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300`}>
          LearnLoop
        </h1>
        {showTagline && (
          <p className={`${config.tagline} text-gray-600 group-hover:text-gray-500 transition-colors duration-300 -mt-1`}>
            Learn by Teaching • Teach by Learning
          </p>
        )}
      </div>
    </Link>
  );
};

export default MinimalLogo;