# Authentication Setup Guide

This document explains how to set up authentication for the SmartAssist application.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smartassist"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Email (for password reset)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create a database** named `smartassist`
3. **Update DATABASE_URL** with your PostgreSQL credentials
4. **Run Prisma migrations**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### GitHub OAuth
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

## NextAuth Secret

Generate a secure secret for NextAuth.js:

```bash
openssl rand -base64 32
```

Add this to your `.env` file as `NEXTAUTH_SECRET`.

## Email Configuration (for password reset)

Configure SMTP settings for sending password reset emails:
- Gmail: `smtp.gmail.com:587`
- SendGrid: `smtp.sendgrid.net:587`
- Mailgun: `smtp.mailgun.org:587`

## Testing Authentication

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/auth/signin`
3. Test registration and login flows
4. Verify OAuth providers work (if configured)

## Security Notes

- Always use HTTPS in production
- Use strong, unique secrets
- Regularly rotate OAuth credentials
- Monitor authentication logs
- Implement rate limiting for auth endpoints