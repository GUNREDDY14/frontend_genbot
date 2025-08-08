'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/layout/Dashboard";
import StatCard from "@/components/dashboard/StatCard";
import HotLeads from "@/components/dashboard/HotLeads";
import { Button } from "@/components/ui/Button";
import { DashboardStats, LeadData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { RiRobot3Fill } from "react-icons/ri";
import { Plus, Bot, Search } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeChatbots, setActiveChatbots] = useState<number>(1);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (!user?.companyId) return;
    
    // Simulate fetching chatbots data
    setActiveChatbots(1);
  }, [user?.companyId]);

  // Fetch leads data
  useEffect(() => {
    if (!user?.companyId) return;
    
    setIsLoadingLeads(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock leads data for testing
      const mockLeads: LeadData[] = [
        {
          thread_id: "thread_123",
          chatbot_id: "demo-chatbot",
          summary: "Customer inquired about pricing for enterprise plan and showed interest in AI features.",
          sentiment_analysis: {
            Reasoning: "Customer asked specific questions about pricing and features",
            Sentiment: "Positive"
          },
          lead_information: {
            Email: "john.doe@example.com",
            "Phone Number": "+1-555-0123"
          },
          created_at: new Date().toISOString()
        },
        {
          thread_id: "thread_124",
          chatbot_id: "demo-chatbot",
          summary: "User requested demo of chatbot integration capabilities.",
          sentiment_analysis: {
            Reasoning: "User is actively seeking product demonstration",
            Sentiment: "Positive"
          },
          lead_information: {
            Email: "sarah.smith@company.com",
            "Phone Number": "+1-555-0456"
          },
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];
      
      setLeads(mockLeads);
      setIsLoadingLeads(false);
    }, 2000);
  }, [user?.companyId]);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for dashboard stats
  const stats: DashboardStats = {
    activeChatbots: activeChatbots,
    newLeads: leads.length,
    conversations: 142,
    campaigns: 2
  };

  return (
    <Dashboard 
      title="Dashboard" 
      description="Overview of your chatbots and leads"
    >
      <div className={`transition-opacity duration-700 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/chatbot/create')}
            className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your Bot
          </Button>
          <Button
            onClick={() => router.push('/seo-analysis')}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-4 h-4 mr-2" />
            Get SEO Analysis
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border border-amber-200/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-amber-700 font-medium">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Active Chatbots"
            value={stats.activeChatbots}
            iconElement={<RiRobot3Fill />}
            iconBgColor="bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100"
            iconTextColor="text-cyan-600"
            linkText="View all"
            linkHref="/chatbot/demo-company/demo-chatbot"
          />
        </div>
        
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <StatCard
            title="New Leads (7d)"
            value={stats.newLeads}
            iconElement={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            iconBgColor="bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100"
            iconTextColor="text-emerald-600"
            linkText="View all"
            linkHref="/leads"
          />
        </div>
        
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <StatCard
            title="Conversations (7d)"
            value={stats.conversations}
            iconElement={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            iconBgColor="bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100"
            iconTextColor="text-violet-600"
            linkText="View all"
            linkHref="/conversations"
          />
        </div>
        
        <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <StatCard
            title="Email Campaigns"
            value={stats.campaigns}
            iconElement={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            iconBgColor="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100"
            iconTextColor="text-orange-600"
            linkText="View all"
            linkHref="/outreach"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
        <HotLeads leads={leads} isLoading={isLoadingLeads} />
      </div>
      </div>
    </Dashboard>
  );
}