// src/utils/formatters.ts

import { 
  PROFICIENCY_LEVELS, 
  EXCHANGE_STATUS, 
  SESSION_TYPES,
  SKILL_CATEGORIES 
} from './constants';

// =============================================================================
// DATE & TIME FORMATTERS
// =============================================================================

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString('en-US', options || defaultOptions);
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

// =============================================================================
// USER & PROFILE FORMATTERS
// =============================================================================

export const formatUserName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'Anonymous User';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

export const formatUserInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
};

export const formatEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const formatPhone = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format international numbers (basic formatting)
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, -10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
  
  return phone; // Return original if can't format
};

export const formatBio = (bio: string, maxLength: number = 150): string => {
  if (bio.length <= maxLength) return bio;
  return bio.substring(0, maxLength).trim() + '...';
};

// =============================================================================
// SKILL FORMATTERS
// =============================================================================

export const formatSkillName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatProficiencyLevel = (level: string) => {
  const proficiency = Object.values(PROFICIENCY_LEVELS).find(p => p.value === level);
  return proficiency || PROFICIENCY_LEVELS.BEGINNER;
};

export const formatSkillCategory = (category: string) => {
  const categoryKey = category.toUpperCase() as keyof typeof SKILL_CATEGORIES;
  return SKILL_CATEGORIES[categoryKey] || SKILL_CATEGORIES.OTHER;
};

export const formatYearsOfExperience = (years: number): string => {
  if (years === 0) return 'Less than 1 year';
  if (years === 1) return '1 year';
  return `${years} years`;
};

export const formatSkillTags = (tags: string[]): string[] => {
  return tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
};

// =============================================================================
// EXCHANGE & SESSION FORMATTERS
// =============================================================================

export const formatExchangeStatus = (status: string) => {
  const statusKey = status.toUpperCase() as keyof typeof EXCHANGE_STATUS;
  return EXCHANGE_STATUS[statusKey] || EXCHANGE_STATUS.PENDING;
};

export const formatSessionType = (type: string) => {
  const typeKey = type.toUpperCase() as keyof typeof SESSION_TYPES;
  return SESSION_TYPES[typeKey] || SESSION_TYPES.VIDEO;
};

export const formatExchangeTitle = (skill1: string, skill2: string): string => {
  return `${skill1} ↔ ${skill2}`;
};

export const formatSessionDuration = (startTime: Date, endTime: Date): string => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));
  return formatDuration(durationMinutes);
};

// =============================================================================
// RATING & REVIEW FORMATTERS
// =============================================================================

export const formatRating = (rating: number, precision: number = 1): string => {
  return rating.toFixed(precision);
};

export const formatRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};

export const formatReviewCount = (count: number): string => {
  if (count === 0) return 'No reviews';
  if (count === 1) return '1 review';
  return `${count} reviews`;
};

// =============================================================================
// NUMBER & CURRENCY FORMATTERS
// =============================================================================

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', { 
    notation: 'compact',
    maximumFractionDigits: 1 
  }).format(num);
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// =============================================================================
// FILE & SIZE FORMATTERS
// =============================================================================

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${Math.round(size * 100) / 100} ${sizes[i]}`;
};

export const formatFileName = (fileName: string, maxLength: number = 30): string => {
  if (fileName.length <= maxLength) return fileName;
  
  const extension = fileName.split('.').pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4);
  
  return `${truncatedName}...${extension}`;
};

// =============================================================================
// TEXT & CONTENT FORMATTERS
// =============================================================================

export const formatTruncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const formatCapitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatTitleCase = (text: string): string => {
  return text
    .split(' ')
    .map(word => formatCapitalize(word))
    .join(' ');
};

export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export const formatLineBreaks = (text: string): string => {
  return text.replace(/\n/g, '<br />');
};

export const formatHashtags = (text: string): string => {
  return text.replace(/#(\w+)/g, '<span class="text-blue-600 font-medium">#$1</span>');
};

export const formatMentions = (text: string): string => {
  return text.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>');
};

// =============================================================================
// URL & LINK FORMATTERS
// =============================================================================

export const formatUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const formatDomainName = (url: string): string => {
  try {
    const domain = new URL(formatUrl(url)).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

export const formatSocialHandle = (handle: string, platform: 'twitter' | 'linkedin' | 'github'): string => {
  const cleanHandle = handle.replace('@', '');
  
  const baseUrls = {
    twitter: 'https://twitter.com/',
    linkedin: 'https://linkedin.com/in/',
    github: 'https://github.com/',
  };
  
  return baseUrls[platform] + cleanHandle;
};

// =============================================================================
// SEARCH & FILTER FORMATTERS
// =============================================================================

export const formatSearchQuery = (query: string): string => {
  return query.trim().toLowerCase();
};

export const formatSearchResults = (count: number, query: string): string => {
  if (count === 0) return `No results found for "${query}"`;
  if (count === 1) return `1 result for "${query}"`;
  return `${formatNumber(count)} results for "${query}"`;
};

export const formatFilterLabel = (key: string, value: string): string => {
  const formattedKey = formatTitleCase(key.replace(/_/g, ' '));
  const formattedValue = formatTitleCase(value.replace(/_/g, ' '));
  return `${formattedKey}: ${formattedValue}`;
};

// =============================================================================
// ADDRESS & LOCATION FORMATTERS
// =============================================================================

export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatLocation = (city?: string, state?: string, country?: string): string => {
  const parts = [city, state, country].filter(Boolean);
  return parts.join(', ');
};

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// =============================================================================
// VALIDATION FORMATTERS
// =============================================================================

export const formatValidationError = (error: string): string => {
  return error.charAt(0).toUpperCase() + error.slice(1);
};

export const formatFieldName = (fieldName: string): string => {
  return fieldName
    .split(/(?=[A-Z])|_/)
    .map(word => formatCapitalize(word))
    .join(' ');
};

// =============================================================================
// EXPORT HELPER FUNCTIONS
// =============================================================================

export const formatters = {
  // Date & Time
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  relativeTime: formatRelativeTime,
  duration: formatDuration,
  timeRange: formatTimeRange,

  // User & Profile
  userName: formatUserName,
  userInitials: formatUserInitials,
  email: formatEmail,
  phone: formatPhone,
  bio: formatBio,

  // Skills
  skillName: formatSkillName,
  proficiencyLevel: formatProficiencyLevel,
  skillCategory: formatSkillCategory,
  yearsOfExperience: formatYearsOfExperience,
  skillTags: formatSkillTags,

  // Exchange & Session
  exchangeStatus: formatExchangeStatus,
  sessionType: formatSessionType,
  exchangeTitle: formatExchangeTitle,
  sessionDuration: formatSessionDuration,

  // Rating & Review
  rating: formatRating,
  ratingStars: formatRatingStars,
  reviewCount: formatReviewCount,

  // Numbers & Currency
  number: formatNumber,
  compactNumber: formatCompactNumber,
  percentage: formatPercentage,
  currency: formatCurrency,

  // Files & Size
  fileSize: formatFileSize,
  fileName: formatFileName,

  // Text & Content
  truncate: formatTruncate,
  capitalize: formatCapitalize,
  titleCase: formatTitleCase,
  slug: formatSlug,
  lineBreaks: formatLineBreaks,
  hashtags: formatHashtags,
  mentions: formatMentions,

  // URLs & Links
  url: formatUrl,
  domainName: formatDomainName,
  socialHandle: formatSocialHandle,

  // Search & Filter
  searchQuery: formatSearchQuery,
  searchResults: formatSearchResults,
  filterLabel: formatFilterLabel,

  // Address & Location
  address: formatAddress,
  location: formatLocation,
  coordinates: formatCoordinates,

  // Validation
  validationError: formatValidationError,
  fieldName: formatFieldName,
};