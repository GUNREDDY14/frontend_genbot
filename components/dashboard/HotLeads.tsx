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
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Hot Leads</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading leads...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Hot Leads</h3>
        <span className="text-sm text-muted-foreground">{leads.length} leads</span>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-muted-foreground">No leads found</p>
          <p className="text-sm text-muted-foreground mt-1">Leads will appear here when customers interact with your chatbots</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Lead #{index + 1}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(lead.sentiment_analysis.Sentiment)}`}>
                      {lead.sentiment_analysis.Sentiment}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {lead.summary}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {lead.lead_information.Email && (
                      <span>📧 {lead.lead_information.Email}</span>
                    )}
                    {lead.lead_information["Phone Number"] && (
                      <span>📞 {lead.lead_information["Phone Number"]}</span>
                    )}
                    <span>🕒 {formatDate(lead.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 