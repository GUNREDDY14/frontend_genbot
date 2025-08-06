# GenBotAI Project Structure

This document outlines the organization and conventions for the GenBotAI codebase.

## 📁 Directory Structure

```
smartassist/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Authentication pages (grouped route)
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── chatbot/              # Chatbot management APIs
│   │   ├── scraping/             # Web scraping APIs
│   │   └── stripe/               # Payment processing APIs
│   ├── dashboard/                # Main dashboard pages
│   ├── pricing/                  # Pricing page
│   ├── account/                  # Account management
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (buttons, inputs, etc.)
│   ├── auth/                     # Authentication-specific components
│   ├── dashboard/                # Dashboard-specific components
│   └── chatbot/                  # Chatbot-related components
├── lib/                          # Core business logic and configurations
│   ├── auth/                     # Authentication logic
│   ├── database/                 # Database configuration and queries
│   ├── scraping/                 # Web scraping logic
│   └── ai/                       # AI/OpenAI integration
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── constants/                    # Application constants
├── utils/                        # Utility functions
├── public/                       # Static assets
└── prisma/                       # Database schema and migrations (to be created)
```

## 🏗️ Architecture Principles

### 1. **Feature-Based Organization**
- Group related files by feature/domain (auth, dashboard, chatbot)
- Keep components close to where they're used when possible

### 2. **Separation of Concerns**
- **`app/`**: Routing and page components
- **`components/`**: Reusable UI components
- **`lib/`**: Business logic and integrations
- **`utils/`**: Pure utility functions
- **`types/`**: Type definitions
- **`constants/`**: Application constants

### 3. **Next.js App Router Conventions**
- Use `page.tsx` for pages
- Use `layout.tsx` for layouts
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages

## 📝 Naming Conventions

### Files and Directories
- **Pages**: `kebab-case` (e.g., `sign-up`, `user-profile`)
- **Components**: `PascalCase` (e.g., `ChatbotPreview.tsx`)
- **Utilities**: `camelCase` (e.g., `formatDate.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS`)
- **Directories**: `kebab-case` or `camelCase` (be consistent)

### Variables and Functions
- **Variables**: `camelCase`
- **Functions**: `camelCase`
- **React Components**: `PascalCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

## 🔧 Code Organization Patterns

### Component Structure
```typescript
// components/ui/Button.tsx
import { cn } from '@/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          // variant styles...
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### API Route Structure
```typescript
// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Business logic here...
    
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Custom Hook Structure
```typescript
// hooks/useChatbot.ts
import { useState, useEffect } from 'react';
import { Chatbot } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export function useChatbot(chatbotId: string) {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch chatbot data...
  }, [chatbotId]);

  const updateChatbot = async (updates: Partial<Chatbot>) => {
    // Update logic...
  };

  return {
    chatbot,
    loading,
    error,
    updateChatbot,
  };
}
```

## 🎯 Import Organization

### Import Order
1. React and Next.js imports
2. Third-party library imports
3. Internal imports (components, utils, types)
4. Relative imports

```typescript
// ✅ Good import organization
import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import axios from 'axios';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { ApiResponse } from '@/types';
import { API_ENDPOINTS } from '@/constants';

import './styles.css';
```

## 🚀 Development Guidelines

### 1. **TypeScript First**
- Always use TypeScript
- Define interfaces for all data structures
- Use strict type checking

### 2. **Component Guidelines**
- Keep components small and focused
- Use composition over inheritance
- Extract custom hooks for complex logic
- Use forwardRef for reusable UI components

### 3. **State Management**
- Use React hooks for local state
- Consider Zustand for global state if needed
- Keep server state separate (React Query/SWR)

### 4. **Error Handling**
- Use try-catch blocks in API routes
- Implement error boundaries for components
- Provide meaningful error messages

### 5. **Performance**
- Use dynamic imports for code splitting
- Optimize images with Next.js Image component
- Implement proper loading states

### 6. **Security**
- Validate all inputs (client and server-side)
- Sanitize user-generated content
- Use environment variables for secrets
- Implement proper authentication checks

## 📦 Dependency Management

### Core Dependencies
- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS v4
- **Database**: Prisma + PostgreSQL
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod
- **UI**: Headless UI + Heroicons
- **HTTP**: Axios
- **Web Scraping**: Playwright
- **Payment**: Stripe

### Development Guidelines
- Keep dependencies up to date
- Use exact versions for critical dependencies
- Regularly audit for security vulnerabilities
- Document any breaking changes

## 🧪 Testing Structure (Future)

```
smartassist/
├── __tests__/                    # Test files
│   ├── components/               # Component tests
│   ├── pages/                    # Page tests
│   ├── api/                      # API route tests
│   └── utils/                    # Utility function tests
```

## 📚 Additional Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Best Practices](https://typescript-lang.org/docs/)
- [React Best Practices](https://react.dev/learn)

This structure is designed to scale with the GenBotAI application while maintaining code quality and developer experience.