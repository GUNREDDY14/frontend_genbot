'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { APP_NAME, URLS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSignInConfig, GoogleButtonOptions, GoogleCredentialResponse } from '@/types/google-auth';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin, companyId } = useAuth();
  const message = searchParams.get('message');

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    const idToken = response.credential;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      setSuccess('Authenticating with Google...');
      await googleLogin(idToken);
      setSuccess('Google Sign-In successful! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(URLS.DASHBOARD);
      }, 1000);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [googleLogin, router]);

  const initializeGoogleSignIn = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '509838209146-4n5t374u95tjumcof4r6milatqro07is.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_prompt: false,
      });

      // Render the Google Sign-In button with larger size
      const googleButtonElement = document.getElementById('google-signin-button');
      if (googleButtonElement) {
        window.google.accounts.id.renderButton(googleButtonElement, {
          type: 'standard',
          size: 'large',
          theme: 'outline',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    }
  }, [handleCredentialResponse]);

  // Initialize Google Sign-In
  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [initializeGoogleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      setSuccess('Signing in...');
      await login(formData.email, formData.password);
      setSuccess('Sign-in successful! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(URLS.DASHBOARD);
      }, 1000);
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Sign-in failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back to {APP_NAME}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
          
          {/* Company ID Display */}
          {companyId && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <span className="font-medium">Company ID:</span> {companyId}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This ID will be used consistently across all features
              </p>
            </div>
          )}
        </div>

        {/* Google Sign-In Button */}
        <div className="mb-6">
          <div 
            id="google-signin-button" 
            className="w-full flex justify-center"
            style={{
              transform: 'scale(1.2)',
              transformOrigin: 'center',
              margin: '20px 0'
            }}
          ></div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Sign-in Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{success}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href={URLS.SIGNUP} className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}