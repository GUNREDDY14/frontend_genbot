'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface TrendData {
  value: number;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  iconElement?: ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  linkText?: string;
  linkHref?: string;
  trend?: TrendData;
}

export default function StatCard({
  title,
  value,
  iconElement,
  iconBgColor = "bg-blue-100",
  iconTextColor = "text-blue-600",
  linkText,
  linkHref,
  trend
}: StatCardProps) {
  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-300/40 relative overflow-hidden">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {iconElement && (
            <div className={`p-3 rounded-xl ${iconBgColor} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
              <div className={`text-xl ${iconTextColor} group-hover:scale-110 transition-transform duration-300`}>
                {iconElement}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-2">from last month</span>
            </div>
          )}
        </div>
        
        {linkText && linkHref && (
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <Link 
              href={linkHref}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 group-hover:translate-x-1"
            >
              {linkText}
              <svg 
                className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 