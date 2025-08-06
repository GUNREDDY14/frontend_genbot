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
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {iconElement && (
            <div className={`p-3 rounded-lg ${iconBgColor} mr-4`}>
              <div className={`text-xl ${iconTextColor}`}>
                {iconElement}
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            {trend && (
              <div className="flex items-center mt-1">
                <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {linkText && linkHref && (
        <div className="mt-4">
          <Link 
            href={linkHref}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {linkText} →
          </Link>
        </div>
      )}
    </div>
  );
} 