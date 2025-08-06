# GenBotAI Environment Configuration Guide

This document outlines all the environment variables needed for GenBotAI to function properly.

## 📋 Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

### 🚀 App Configuration
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 🗄️ Database Configuration
```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/genbotai_dev"
```

### 🔐 Authentication (NextAuth.js)
```bash
# Generate a random secret: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET=your-super-secret-jwt-key-here-32-characters
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional for MVP)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
```

### 🤖 AI Services
```bash
# OpenAI API for chatbot generation
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 📧 Email Configuration
```bash
# For password reset emails
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@genbotai.com
```

### 🕷️ Web Scraping Configuration
```bash
MAX_SCRAPING_PAGES=50
SCRAPING_TIMEOUT=30000
SCRAPING_USER_AGENT=GenBotAI-Scraper/1.0
```

### 💳 Payment Processing (Stripe)
```bash
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### ⚡ Redis (for caching and job queues)
```bash
REDIS_URL=redis://localhost:6379
```

### 📊 Monitoring & Analytics (optional)
```bash
SENTRY_DSN=your-sentry-dsn-here
GOOGLE_ANALYTICS_ID=your-ga-id-here
```

### 🎛️ Feature Flags
```bash
ENABLE_SOCIAL_LOGIN=true
ENABLE_GOOGLE_LOGIN=true
ENABLE_GITHUB_LOGIN=true
ENABLE_STRIPE_PAYMENTS=true
```

## 🛠️ Setup Instructions

1. **Copy the template**: Create a `.env.local` file in your project root
2. **Fill in values**: Replace all placeholder values with your actual credentials
3. **Secure your keys**: Never commit `.env.local` to version control
4. **Database setup**: Ensure PostgreSQL is running and the database exists
5. **Redis setup**: Install and start Redis server locally

## 🔑 Getting API Keys

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key

### Google OAuth (optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### GitHub OAuth (optional)
1. Go to GitHub Settings > Developer settings
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/api/auth/callback/github`

### Stripe (for payments)
1. Visit [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable and secret keys from the API section
3. Set up webhooks for subscription events

## 🚨 Security Notes

- **Never** commit `.env.local` or any environment files to version control
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- In production, use environment variables provided by your hosting platform
- Regularly rotate API keys and secrets
- Use test/sandbox keys during development

## 🏃‍♂️ Quick Start (Minimal Setup)

For initial development, you only need:
```bash
NEXTAUTH_SECRET=your-32-character-secret-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://user:pass@localhost:5432/genbotai_dev"
OPENAI_API_KEY=sk-your-openai-key
```

Additional services can be added as you develop those features.