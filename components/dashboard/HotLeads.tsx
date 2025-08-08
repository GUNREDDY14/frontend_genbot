'use client';

import React from 'react';
import { LeadData } from '@/types';

interface HotLeadsProps {
  leads: LeadData[];
  isLoading: boolean;
}

export default function HotLeads({ leads, isLoading }: HotLeadsProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-emerald-700 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200/50';
      case 'negative':
        return 'text-red-700 bg-gradient-to-r from-red-100 to-rose-100 border border-red-200/50';
      case 'neutral':
        return 'text-slate-700 bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-200/50';
      default:
        return 'text-slate-700 bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-200/50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 rounded-xl shadow-sm">
            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Hot Leads</h3>
            <p className="text-sm text-slate-500">High-interest prospects</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
            <span className="text-slate-600">Loading leads...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 rounded-xl shadow-sm">
            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Hot Leads</h3>
            <p className="text-sm text-slate-500">High-interest prospects</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full border border-blue-200/50 shadow-sm">
            {leads.length} leads
          </span>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-slate-800 mb-2">No leads yet</h4>
          <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
            Leads will appear here when customers interact with your chatbots and show high interest in your products or services.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <div key={index} className="group border border-slate-200/60 rounded-xl p-5 bg-gradient-to-br from-white/50 to-slate-50/30 hover:shadow-lg hover:border-blue-300/40 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-sm font-semibold text-slate-800">
                        Lead #{index + 1}
                      </span>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getSentimentColor(lead.sentiment_analysis.Sentiment)}`}>
                      {lead.sentiment_analysis.Sentiment}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {lead.summary}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {lead.lead_information.Email && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-200/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{lead.lead_information.Email}</span>
                      </div>
                    )}
                    {lead.lead_information["Phone Number"] && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg border border-green-200/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{lead.lead_information["Phone Number"]}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-200/50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 