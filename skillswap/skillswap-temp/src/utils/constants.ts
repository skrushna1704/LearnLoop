// src/utils/constants.ts

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      UPLOAD_AVATAR: '/users/avatar',
      GET_USER: (id: string) => `/users/${id}`,
      SEARCH: '/users/search',
    },
    SKILLS: {
      LIST: '/skills',
      CREATE: '/skills',
      UPDATE: (id: string) => `/skills/${id}`,
      DELETE: (id: string) => `/skills/${id}`,
      SEARCH: '/skills/search',
      CATEGORIES: '/skills/categories',
    },
    EXCHANGES: {
      LIST: '/exchanges',
      CREATE: '/exchanges',
      UPDATE: (id: string) => `/exchanges/${id}`,
      DELETE: (id: string) => `/exchanges/${id}`,
      ACCEPT: (id: string) => `/exchanges/${id}/accept`,
      DECLINE: (id: string) => `/exchanges/${id}/decline`,
    },
    MESSAGES: {
      LIST: (exchangeId: string) => `/exchanges/${exchangeId}/messages`,
      SEND: (exchangeId: string) => `/exchanges/${exchangeId}/messages`,
      MARK_READ: (messageId: string) => `/messages/${messageId}/read`,
    },
    REVIEWS: {
      CREATE: '/reviews',
      GET_USER_REVIEWS: (userId: string) => `/users/${userId}/reviews`,
    },
  },
};

// =============================================================================
// APP CONFIGURATION
// =============================================================================

export const APP_CONFIG = {
  NAME: 'LearnLoop',
  DESCRIPTION: 'The world\'s first AI-powered skill exchange platform',
  VERSION: '1.0.0',
  CONTACT_EMAIL: 'hello@LearnLoop.com',
  SUPPORT_EMAIL: 'support@LearnLoop.com',
  SOCIAL_LINKS: {
    TWITTER: 'https://twitter.com/LearnLoop',
    LINKEDIN: 'https://linkedin.com/company/LearnLoop',
    GITHUB: 'https://github.com/LearnLoop',
  },
  FEATURES: {
    REAL_TIME_MESSAGING: true,
    VIDEO_CALLS: true,
    AI_MATCHING: false, // Will be enabled later
    PREMIUM_FEATURES: false, // Will be enabled later
    NOTIFICATIONS: true,
  },
};

// =============================================================================
// SKILL CATEGORIES & SUBCATEGORIES
// =============================================================================

export const SKILL_CATEGORIES = {
  PROGRAMMING: {
    name: 'Programming',
    icon: '💻',
    subcategories: [
      'Web Development',
      'Mobile Development',
      'Backend Development',
      'DevOps',
      'Data Science',
      'Machine Learning',
      'Game Development',
      'Blockchain',
    ],
  },
  DESIGN: {
    name: 'Design',
    icon: '🎨',
    subcategories: [
      'UI/UX Design',
      'Graphic Design',
      'Web Design',
      'Product Design',
      'Brand Design',
      'Motion Graphics',
      'Photography',
      'Video Editing',
    ],
  },
  MARKETING: {
    name: 'Marketing',
    icon: '📈',
    subcategories: [
      'Digital Marketing',
      'Content Marketing',
      'Social Media',
      'SEO/SEM',
      'Email Marketing',
      'Copywriting',
      'Brand Strategy',
      'Analytics',
    ],
  },
  BUSINESS: {
    name: 'Business',
    icon: '💼',
    subcategories: [
      'Entrepreneurship',
      'Project Management',
      'Sales',
      'Finance',
      'Operations',
      'Strategy',
      'Leadership',
      'Public Speaking',
    ],
  },
  LANGUAGES: {
    name: 'Languages',
    icon: '🌍',
    subcategories: [
      'English',
      'Spanish',
      'French',
      'German',
      'Mandarin',
      'Japanese',
      'Arabic',
      'Other Languages',
    ],
  },
  MUSIC: {
    name: 'Music',
    icon: '🎵',
    subcategories: [
      'Piano',
      'Guitar',
      'Vocals',
      'Music Production',
      'Composition',
      'Audio Engineering',
      'Music Theory',
      'Other Instruments',
    ],
  },
  FITNESS: {
    name: 'Fitness',
    icon: '💪',
    subcategories: [
      'Personal Training',
      'Yoga',
      'Nutrition',
      'Running',
      'Weight Training',
      'Sports Coaching',
      'Meditation',
      'Dance',
    ],
  },
  OTHER: {
    name: 'Other',
    icon: '🔧',
    subcategories: [
      'Cooking',
      'Crafts',
      'Tutoring',
      'Life Coaching',
      'Career Guidance',
      'Technical Writing',
      'Consulting',
      'Mentoring',
    ],
  },
} as const;

// =============================================================================
// PROFICIENCY LEVELS
// =============================================================================

export const PROFICIENCY_LEVELS = {
  BEGINNER: {
    value: 'beginner',
    label: 'Beginner',
    description: 'Just starting out or basic understanding',
    color: 'bg-green-100 text-green-800',
  },
  INTERMEDIATE: {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Some experience and practical knowledge',
    color: 'bg-blue-100 text-blue-800',
  },
  ADVANCED: {
    value: 'advanced',
    label: 'Advanced',
    description: 'Extensive experience and deep knowledge',
    color: 'bg-purple-100 text-purple-800',
  },
  EXPERT: {
    value: 'expert',
    label: 'Expert',
    description: 'Professional level with ability to teach others',
    color: 'bg-yellow-100 text-yellow-800',
  },
} as const;

// =============================================================================
// EXCHANGE STATUS
// =============================================================================

export const EXCHANGE_STATUS = {
  PENDING: {
    value: 'pending',
    label: 'Pending',
    description: 'Waiting for response',
    color: 'bg-yellow-100 text-yellow-800',
  },
  ACCEPTED: {
    value: 'accepted',
    label: 'Accepted',
    description: 'Exchange has been accepted',
    color: 'bg-green-100 text-green-800',
  },
  DECLINED: {
    value: 'declined',
    label: 'Declined',
    description: 'Exchange has been declined',
    color: 'bg-red-100 text-red-800',
  },
  IN_PROGRESS: {
    value: 'in_progress',
    label: 'In Progress',
    description: 'Exchange is currently active',
    color: 'bg-blue-100 text-blue-800',
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completed',
    description: 'Exchange has been completed',
    color: 'bg-gray-100 text-gray-800',
  },
  CANCELLED: {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Exchange has been cancelled',
    color: 'bg-red-100 text-red-800',
  },
} as const;

// =============================================================================
// SESSION TYPES
// =============================================================================

export const SESSION_TYPES = {
  VIDEO: {
    value: 'video',
    label: 'Video Call',
    icon: '📹',
    description: 'Online video session',
  },
  PHONE: {
    value: 'phone',
    label: 'Phone Call',
    icon: '📞',
    description: 'Voice-only phone call',
  },
  IN_PERSON: {
    value: 'in-person',
    label: 'In Person',
    icon: '🤝',
    description: 'Meet in person',
  },
  CHAT: {
    value: 'chat',
    label: 'Text Chat',
    icon: '💬',
    description: 'Text-based conversation',
  },
} as const;

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export const NOTIFICATION_TYPES = {
  EXCHANGE_REQUEST: 'exchange_request',
  EXCHANGE_ACCEPTED: 'exchange_accepted',
  EXCHANGE_DECLINED: 'exchange_declined',
  SESSION_SCHEDULED: 'session_scheduled',
  SESSION_REMINDER: 'session_reminder',
  MESSAGE_RECEIVED: 'message_received',
  REVIEW_RECEIVED: 'review_received',
  SKILL_MATCH: 'skill_match',
  SYSTEM_UPDATE: 'system_update',
} as const;

// =============================================================================
// FILE UPLOAD LIMITS
// =============================================================================

export const UPLOAD_LIMITS = {
  AVATAR: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_DIMENSIONS: { width: 1024, height: 1024 },
  },
  PORTFOLIO: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'video/mp4',
      'video/webm',
    ],
    MAX_FILES: 5,
  },
  MESSAGE_ATTACHMENT: {
    MAX_SIZE: 25 * 1024 * 1024, // 25MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    MAX_FILES: 3,
  },
} as const;

// =============================================================================
// PAGINATION
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  SKILL_CARDS_PER_PAGE: 12,
  MESSAGES_PER_PAGE: 50,
  EXCHANGES_PER_PAGE: 10,
  REVIEWS_PER_PAGE: 10,
} as const;

// =============================================================================
// TIMEOUTS & INTERVALS
// =============================================================================

export const TIMEOUTS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MESSAGE_RETRY: 5000, // 5 seconds
  SEARCH_DEBOUNCE: 300, // 300ms
  AUTO_SAVE: 10000, // 10 seconds
  NOTIFICATION_DISPLAY: 5000, // 5 seconds
} as const;

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  URL: /^https?:\/\/.+/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL: /[^A-Za-z0-9]/,
  },
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'LearnLoop_auth_token',
  REFRESH_TOKEN: 'LearnLoop_refresh_token',
  USER_PREFERENCES: 'LearnLoop_user_preferences',
  THEME: 'LearnLoop_theme',
  LANGUAGE: 'LearnLoop_language',
  SIDEBAR_COLLAPSED: 'LearnLoop_sidebar_collapsed',
  RECENT_SEARCHES: 'LearnLoop_recent_searches',
  DRAFT_MESSAGES: 'LearnLoop_draft_messages',
} as const;

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Please contact support if you believe this is an error.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a supported file format.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  RATE_LIMITED: 'Too many requests. Please slow down and try again.',
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  SKILL_CREATED: 'Skill added successfully!',
  SKILL_UPDATED: 'Skill updated successfully!',
  SKILL_DELETED: 'Skill deleted successfully!',
  EXCHANGE_CREATED: 'Exchange proposal sent successfully!',
  EXCHANGE_ACCEPTED: 'Exchange accepted successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  EMAIL_VERIFIED: 'Email verified successfully!',
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURE_FLAGS = {
  ENABLE_AI_MATCHING: process.env.NEXT_PUBLIC_ENABLE_AI_MATCHING === 'true',
  ENABLE_VIDEO_CALLS: process.env.NEXT_PUBLIC_ENABLE_VIDEO_CALLS === 'true',
  ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_PUSH_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;

// =============================================================================
// EXPORTED TYPES
// =============================================================================

export type SkillCategory = keyof typeof SKILL_CATEGORIES;
export type ProficiencyLevel = keyof typeof PROFICIENCY_LEVELS;
export type ExchangeStatus = keyof typeof EXCHANGE_STATUS;
export type SessionType = keyof typeof SESSION_TYPES;
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];