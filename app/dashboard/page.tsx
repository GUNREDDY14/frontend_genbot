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
import { Plus, Bot } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeChatbots, setActiveChatbots] = useState<number>(1);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

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
      {/* Create Bot Button */}
      <div className="mb-6">
        <Button
          onClick={() => router.push('/chatbot/create')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your Bot
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Active Chatbots"
          value={stats.activeChatbots}
          iconElement={<RiRobot3Fill />}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          linkText="View all"
          linkHref="/chatbot/demo-company/demo-chatbot"
        />
        
        <StatCard
          title="New Leads (7d)"
          value={stats.newLeads}
          iconElement={<span>👥</span>}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          linkText="View all"
          linkHref="/leads"
        />
        
        <StatCard
          title="Conversations (7d)"
          value={stats.conversations}
          iconElement={<span>💬</span>}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-600"
          linkText="View all"
          linkHref="/conversations"
        />
        
        <StatCard
          title="Email Campaigns"
          value={stats.campaigns}
          iconElement={<span>📧</span>}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          linkText="View all"
          linkHref="/outreach"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <HotLeads leads={leads} isLoading={isLoadingLeads} />
      </div>
    </Dashboard>
  );
}