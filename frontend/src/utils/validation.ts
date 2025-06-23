// src/utils/validation.ts
import { z } from 'zod';

// =============================================================================
// COMMON VALIDATION RULES
// =============================================================================

// Email validation
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Phone validation
const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits')
  .optional();

// URL validation
const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

// =============================================================================
// USER AUTHENTICATION SCHEMAS
// =============================================================================

// Login form
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Registration form
export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketingEmails: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Forgot password
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  token: z.string().min(1, 'Reset token is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// =============================================================================
// USER PROFILE SCHEMAS
// =============================================================================

// Profile update
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  timezone: z.string().optional(),
  phone: phoneSchema,
  website: urlSchema,
  linkedin: urlSchema,
  twitter: urlSchema,
  github: urlSchema,
  profilePicture: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  availableForExchange: z.boolean().optional(),
});

// Availability schedule
export const availabilitySchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  timeSlots: z.array(z.object({
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  })),
  isAvailable: z.boolean(),
});

// Profile setup (for new users)
export const profileSetupSchema = z.object({
  name: nameSchema,
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  timezone: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  profilePicture: z.string().optional(),
  interests: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
});

// =============================================================================
// SKILL SCHEMAS
// =============================================================================

// Skill categories
const skillCategories = [
  'programming', 'design', 'marketing', 'business', 'languages', 'music', 'photography',
  'writing', 'cooking', 'fitness', 'crafts', 'tutoring', 'other'
] as const;

// Proficiency levels
const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

// Add/Edit skill
export const skillSchema = z.object({
  name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(100, 'Skill name must be less than 100 characters'),
  category: z.enum(skillCategories, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  subcategory: z
    .string()
    .max(50, 'Subcategory must be less than 50 characters')
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  proficiency: z.enum(proficiencyLevels, {
    errorMap: () => ({ message: 'Please select a proficiency level' })
  }),
  yearsOfExperience: z
    .number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience must be reasonable')
    .optional(),
  isOffering: z.boolean(),
  isLearning: z.boolean(),
  portfolio: z.array(z.object({
    title: z.string().min(1, 'Portfolio title is required'),
    description: z.string().max(200, 'Description must be less than 200 characters').optional(),
    url: urlSchema,
    imageUrl: z.string().url().optional(),
  })).optional(),
  tags: z.array(z.string().max(30, 'Tag must be less than 30 characters')).optional(),
}).refine(data => data.isOffering || data.isLearning, {
  message: 'You must either offer or want to learn this skill',
  path: ['isOffering'],
});

// =============================================================================
// EXCHANGE SCHEMAS
// =============================================================================

// Exchange proposal
export const exchangeProposalSchema = z.object({
  receiverId: z.string().min(1, 'Receiver is required'),
  offeredSkillId: z.string().min(1, 'Offered skill is required'),
  requestedSkillId: z.string().min(1, 'Requested skill is required'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  proposedDuration: z
    .number()
    .min(30, 'Duration must be at least 30 minutes')
    .max(480, 'Duration must be less than 8 hours'),
  preferredTimes: z.array(z.object({
    date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  })),
  sessionType: z.enum(['video', 'in-person', 'phone', 'chat']),
  location: z.string().optional(),
});

// Session scheduling
export const sessionSchema = z.object({
  exchangeId: z.string().min(1, 'Exchange ID is required'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  sessionType: z.enum(['video', 'in-person', 'phone', 'chat']),
  location: z.string().optional(),
  agenda: z
    .string()
    .max(500, 'Agenda must be less than 500 characters')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
});

// =============================================================================
// COMMUNICATION SCHEMAS
// =============================================================================

// Message
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters'),
  exchangeId: z.string().min(1, 'Exchange ID is required'),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    size: z.number(),
  })).optional(),
});

// Review/Rating
export const reviewSchema = z.object({
  exchangeId: z.string().min(1, 'Exchange ID is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters'),
  skillTaught: z.string().optional(),
  skillLearned: z.string().optional(),
  wouldRecommend: z.boolean(),
  tags: z.array(z.enum([
    'patient', 'knowledgeable', 'punctual', 'prepared', 'friendly', 
    'clear-communicator', 'flexible', 'professional'
  ])).optional(),
});

// =============================================================================
// SUPPORT/CONTACT SCHEMAS
// =============================================================================

// Contact form
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  category: z.enum(['general', 'technical', 'account', 'safety', 'feature-request']),
});

// Bug report
export const bugReportSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  steps: z
    .string()
    .min(10, 'Steps to reproduce must be at least 10 characters')
    .max(1000, 'Steps must be less than 1000 characters'),
  expectedBehavior: z
    .string()
    .min(10, 'Expected behavior must be at least 10 characters')
    .max(500, 'Expected behavior must be less than 500 characters'),
  actualBehavior: z
    .string()
    .min(10, 'Actual behavior must be at least 10 characters')
    .max(500, 'Actual behavior must be less than 500 characters'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  browser: z.string().optional(),
  device: z.string().optional(),
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Type inference helpers
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;
export type SkillForm = z.infer<typeof skillSchema>;
export type ExchangeProposalForm = z.infer<typeof exchangeProposalSchema>;
export type SessionForm = z.infer<typeof sessionSchema>;
export type MessageForm = z.infer<typeof messageSchema>;
export type ReviewForm = z.infer<typeof reviewSchema>;
export type ContactForm = z.infer<typeof contactSchema>;

// Validation helper function
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
      
      return { success: false, data: null, errors: formattedErrors };
    }
    return { success: false, data: null, errors: { general: 'Validation failed' } };
  }
};

// Safe parse helper
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
};

// Field-level validation for real-time feedback
export const validateField = <T>(schema: z.ZodSchema<T>, fieldName: string, value: unknown) => {
  try {
    // For now, we'll just validate the entire schema
    // In a more complex implementation, you'd extract the specific field schema
    schema.parse({ [fieldName]: value } as T);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid value' };
    }
    return { isValid: false, error: 'Validation error' };
  }
};

// Password strength checker
export const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score < 2) strength = 'weak';
  else if (score < 4) strength = 'fair';
  else if (score < 5) strength = 'good';
  else strength = 'strong';

  return { checks, score, strength };
};

// Custom validation rules
export const customValidations = {
  // Check if email is available (you'll implement the API call)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEmailAvailable: async (_email: string): Promise<boolean> => {
    // TODO: Implement API call to check email availability
    return true;
  },
  
  // Check if username is available
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isUsernameAvailable: async (_username: string): Promise<boolean> => {
    // TODO: Implement API call to check username availability
    return true;
  },
  
  // Validate skill name uniqueness for user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSkillUnique: async (_skillName: string, _userId: string): Promise<boolean> => {
    // TODO: Implement API call to check skill uniqueness
    return true;
  },
};

// Error message formatters
export const formatValidationErrors = (errors: Record<string, string>) => {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message,
  }));
};

export const getFirstError = (errors: Record<string, string>): string | null => {
  const firstError = Object.values(errors)[0];
  return firstError || null;
};