'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { APP_NAME, URLS } from '@/constants';

const COMPANY_TYPES = [
  'E-commerce',
  'SaaS',
  'Agency',
  'Consulting',
  'Healthcare',
  'Education',
  'Real Estate',
  'Financial Services',
  'Manufacturing',
  'Technology',
  'Other'
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: '',
    companyType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(URLS.SIGNIN);
    }
  }, [status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.websiteUrl.trim()) {
      setError('Website URL is required');
      return false;
    }
    if (!formData.companyType) {
      setError('Company type is required');
      return false;
    }

    // Basic URL validation
    try {
      const url = new URL(formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}`);
      if (!url.hostname.includes('.')) {
        throw new Error('Invalid URL');
      }
    } catch {
      setError('Please enter a valid website URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Ensure URL has protocol
      const websiteUrl = formData.websiteUrl.startsWith('http') 
        ? formData.websiteUrl 
        : `https://${formData.websiteUrl}`;

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          websiteUrl,
          companyType: formData.companyType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save onboarding information');
        return;
      }

      // Redirect to dashboard
      router.push(URLS.DASHBOARD);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Redirect to dashboard without saving onboarding data
    router.push(URLS.DASHBOARD);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Welcome to {APP_NAME}!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Let's set up your company profile to get started
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
                Company Name *
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-foreground">
                Website URL *
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                We'll use this to create your personalized chatbot
              </p>
            </div>

            {/* Company Type */}
            <div>
              <label htmlFor="companyType" className="block text-sm font-medium text-foreground">
                Company Type *
              </label>
              <select
                id="companyType"
                name="companyType"
                required
                className="mt-1 block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.companyType}
                onChange={handleInputChange}
              >
                <option value="">Select your industry</option>
                {COMPANY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              Continue to Dashboard
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip for now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can always update this information later in your settings
          </p>
        </form>
      </div>
    </div>
  );
}