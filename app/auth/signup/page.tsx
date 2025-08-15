'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { APP_NAME, URLS } from '@/constants';
import { validatePassword } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSignInConfig, GoogleButtonOptions, GoogleCredentialResponse } from '@/types/google-auth';

export default function SignUpPage() {
  const [step, setStep] = useState<'email' | 'register'>('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const verifiedUserId = searchParams.get('userId');
  const verifiedEmail = searchParams.get('email');
  const { googleLogin } = useAuth();

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    const idToken = response.credential;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      setSuccess('Creating account with Google...');
      await googleLogin(idToken);
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(URLS.DASHBOARD);
      }, 1000);
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      setError('Google Sign-Up failed. Please try again.');
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

      // Render the Google Sign-In button
      const googleButtonElement = document.getElementById('google-signin-button');
      if (googleButtonElement) {
        window.google.accounts.id.renderButton(googleButtonElement, {
          type: 'standard',
          size: 'large',
          theme: 'outline',
          text: 'signup_with',
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

  useEffect(() => {
    // If coming from OTP verification, move to registration step
    if (verified === 'true' && verifiedUserId && verifiedEmail) {
      setStep('register');
      setUserId(verifiedUserId);
      setFormData(prev => ({ ...prev, email: verifiedEmail }));
      setSuccess('Email verified successfully! You can now complete your registration.');
    }
  }, [verified, verifiedUserId, verifiedEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate password in real-time
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          type: 'registration',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setUserId(data.userId);
      setSuccess('OTP sent successfully! Please check your email.');
      
      // Redirect to OTP verification page
      router.push(`${URLS.VERIFY_OTP}?email=${encodeURIComponent(formData.email)}&userId=${data.userId}&type=registration`);
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setError('Password does not meet requirements');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess('Registration successful! Signing you in...');

      // Automatically sign in the user
      // This part is now handled by the useAuth context's googleLogin
      // const signInResult = await signIn('credentials', {
      //   email: formData.email,
      //   password: formData.password,
      //   redirect: false,
      // });

      // if (signInResult?.error) {
      //   setError('Registration successful but automatic sign-in failed. Please sign in manually.');
      //   router.push(URLS.SIGNIN);
      // } else {
        // Redirect to dashboard
        router.push(URLS.DASHBOARD);
      // }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      // This function is now handled by the useAuth context's googleLogin
      // await signIn(provider, { callbackUrl: URLS.DASHBOARD });
      setError(`OAuth sign-in for ${provider} is not directly supported on this page. Please use the Google Sign-In button.`);
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`${provider} sign in failed. Please try again.`);
    }
  };

  if (step === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
              <span className="text-primary-foreground font-bold text-xl">G</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Or{' '}
              <Link href={URLS.SIGNIN} className="font-medium text-primary hover:text-primary/80">
                sign in to your account
              </Link>
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="text-sm text-green-800">{success}</div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>

            {/* Google Sign-In Button */}
            <div id="google-signin-button" className="w-full"></div>

            {/* GitHub Sign-In Button */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {providers.google && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthSignIn('google')}
                  className="w-full"
                >
                  Google
                </Button>
              )}
              {providers.github && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthSignIn('github')}
                  className="w-full"
                >
                  GitHub
                </Button>
              )}
            </div> */}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <span className="text-primary-foreground font-bold text-xl">G</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Complete your registration
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link href={URLS.SIGNIN} className="font-medium text-primary hover:text-primary/80">
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="text-sm text-green-800">{success}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={isLoading}
                className="mt-1"
                readOnly
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Email verified ✓
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={isLoading}
                className="mt-1"
              />
              {passwordErrors.length > 0 && (
                <div className="mt-1 text-xs text-red-600">
                  <ul className="list-disc list-inside">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}