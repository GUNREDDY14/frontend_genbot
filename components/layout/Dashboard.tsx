'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function Dashboard({ title, description, children }: DashboardProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
  };

  const handleNavigateToChatbots = () => {
    router.push('/chatbot/demo-company/demo-chatbot');
  };

  const handleCreateBot = () => {
    router.push('/chatbot/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    GenBotAI
                  </span>
                  <span className="text-xs text-slate-500 -mt-1">AI-Powered Platform</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-sm text-slate-600 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 rounded-full border border-emerald-200/50">
                Welcome, <span className="font-medium text-emerald-700">{user?.name || 'User'}</span>
              </span>
              <button
                onClick={handleNavigateToChatbots}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                🤖 Chatbots
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border border-slate-200/50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">{description}</p>
        </div>

        {children}
      </main>
    </div>
  );
} 