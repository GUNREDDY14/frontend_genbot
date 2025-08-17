// GenBotAI - Core Type Definitions

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  companyId: string;
  companyName?: string;
  websiteUrl?: string;
  companyType?: string;
  onboardingCompleted: boolean;
  isEmailVerified: boolean;
  otpVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chatbot Types
export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  personality: ChatbotPersonality;
  isActive: boolean;
  embedCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotPersonality {
  tone: 'professional' | 'friendly' | 'casual' | 'formal';
  language: string;
  customInstructions?: string;
  fallbackMessage: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  chatbotId: string;
  sessionId: string;
  timestamp: Date;
}

// Web Scraping Types
export interface ScrapingJob {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  chatbotId: string;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface ScrapedContent {
  id: string;
  url: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  scrapingJobId: string;
  createdAt: Date;
}

// Subscription & Billing Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string;
}

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface UsageMetrics {
  userId: string;
  chatbotQueries: number;
  scrapedPages: number;
  period: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface OnboardingForm {
  companyName: string;
  website: string;
  category: string;
}

// Dashboard Types
export interface DashboardStats {
  activeChatbots: number;
  newLeads: number;
  conversations: number;
  campaigns: number;
}

export interface LeadData {
  thread_id: string;
  chatbot_id: string;
  summary: string;
  sentiment_analysis: {
    Reasoning: string;
    Sentiment: string;
  };
  lead_information: {
    Email: string;
    "Phone Number": string;
  };
  created_at: string;
}

export interface ChatbotConfig {
  sources: {
    urls: string[];
    documents: string[];
    additionalInfo: string;
  };
  settings: {
    tone: string;
    timeout: number;
    voiceGender: string;
    speechEnabled: boolean;
    responseLength: string;
    updateFrequency: string;
  };
  appearance: {
    icon: string;
    avatar: string;
    fontSize: number;
    position: string;
    headerText: string;
    showAvatar: boolean;
    widgetWidth: number;
    borderRadius: number;
    primaryColor: string;
    widgetHeight: number;
    showTimestamp: boolean;
    welcomeMessage: string;
    placeholderText: string;
  };
}

export interface Chatbot {
  id: string;
  name: string;
  status: string;
  config: ChatbotConfig;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

// Environment Types
export interface AppConfig {
  database: {
    url: string;
  };
  auth: {
    secret: string;
    url: string;
  };
  openai: {
    apiKey: string;
  };
  stripe: {
    publicKey: string;
    secretKey: string;
  };
}