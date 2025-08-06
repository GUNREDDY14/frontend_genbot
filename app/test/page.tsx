'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/constants';

export default function TestPage() {
  const router = useRouter();

  useEffect(() => {
    // Enable test mode automatically when this page is accessed
    localStorage.setItem('testMode', 'true');
    
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-600">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Test Mode Enabled
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bypassing authentication for testing purposes...
          </p>
        </div>

        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard Now
          </Button>
        </div>

        <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Test Mode Features:</h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Bypasses login/signup authentication</li>
            <li>• Direct access to chatbot interface</li>
            <li>• Full functionality for testing</li>
            <li>• Can be disabled anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 