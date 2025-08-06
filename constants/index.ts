// GenBotAI - Application Constants

// App Configuration
export const APP_NAME = 'GenBotAI';
export const APP_DESCRIPTION = 'Intelligent AI chatbots for your website';
export const APP_VERSION = '1.0.0';

// URL Configuration
export const URLS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRICING: '/pricing',
  ACCOUNT: '/account',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  CHATBOT: {
    LIST: '/api/chatbot',
    CREATE: '/api/chatbot',
    UPDATE: '/api/chatbot',
    DELETE: '/api/chatbot',
    CHAT: '/api/chatbot/chat',
  },
  SCRAPING: {
    START: '/api/scraping/start',
    STATUS: '/api/scraping/status',
    CONTENT: '/api/scraping/content',
  },
  STRIPE: {
    CREATE_CHECKOUT: '/api/stripe/create-checkout',
    WEBHOOK: '/api/stripe/webhook',
    PORTAL: '/api/stripe/portal',
  },
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    monthlyQueries: 100,
    features: [
      'Basic chatbot',
      'Limited queries per month',
      'Standard support',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 29,
    monthlyQueries: 2000,
    features: [
      'Advanced chatbot',
      'Increased query limits',
      'Custom styling',
      'Priority support',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    monthlyQueries: 10000,
    features: [
      'Full access',
      'White-label branding',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
    ],
  },
} as const;

// Company Categories
export const COMPANY_CATEGORIES = [
  'E-commerce',
  'SaaS',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Technology',
  'Consulting',
  'Marketing Agency',
  'Other',
] as const;

// Chatbot Configuration
export const CHATBOT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_CONVERSATION_HISTORY: 50,
  DEFAULT_PERSONALITY: {
    tone: 'professional' as const,
    language: 'en',
    fallbackMessage: "I'm sorry, I don't have information about that. Please contact our support team for assistance.",
  },
  TYPING_DELAY: {
    MIN: 500,
    MAX: 2000,
  },
} as const;

// Web Scraping Limits
export const SCRAPING_LIMITS = {
  MAX_PAGES: 50,
  TIMEOUT: 30000,
  MAX_CONTENT_SIZE: 1000000, // 1MB
  ALLOWED_DOMAINS: [], // Empty means all domains allowed
  USER_AGENT: 'GenBotAI-Scraper/1.0',
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  COMPANY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  WEBSITE_URL: {
    PROTOCOLS: ['http', 'https'],
  },
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  API: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },
  CHATBOT: {
    MESSAGES_PER_MINUTE: 10,
    MESSAGES_PER_HOUR: 100,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Account created successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  CHATBOT_CREATED: 'Chatbot created successfully!',
  SCRAPING_STARTED: 'Website scraping started.',
} as const;