'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, TrendingUp, Target, Lightbulb, CheckCircle, AlertCircle, Clock, BarChart3, Plus } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface SEOAnalysisData {
  type: string;
  agent: string;
  content: string;
}

export default function SEOAnalysisPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [seoData, setSeoData] = useState<SEOAnalysisData | null>(null);
  const [companyId, setCompanyId] = useState<string>('');
  const [chatbotId, setChatbotId] = useState<string>('');
  const [threadId, setThreadId] = useState<string>('');

  // Generate UUIDs for the session
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Initialize UUIDs on component mount
  useEffect(() => {
    if (!companyId) setCompanyId(generateUUID());
    if (!chatbotId) setChatbotId(generateUUID());
    if (!threadId) setThreadId(generateUUID());
  }, []);

  const fetchSEOAnalysis = async () => {
    setIsLoading(true);
    
    try {
      const payload = {
        thread_id: threadId,
        company_id: companyId,
        chatbot_id: chatbotId,
        uuid: ""
      };

      console.log('Fetching SEO analysis with payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/seo/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SEO analysis request failed:', errorText);
        throw new Error(`SEO analysis failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('SEO analysis response:', result);
      
      setSeoData(result);
      
      toast({
        title: "SEO Analysis Complete!",
        description: "Your website SEO analysis has been generated successfully."
      });

    } catch (error) {
      const errorObj = error as Error;
      console.error('Error fetching SEO analysis:', errorObj);
      
      toast({
        title: "SEO Analysis Failed",
        description: "Could not generate SEO analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch SEO analysis when component mounts
  useEffect(() => {
    if (companyId && chatbotId && threadId) {
      fetchSEOAnalysis();
    }
  }, [companyId, chatbotId, threadId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">SEO Analysis</h1>
                  <p className="text-gray-600">Comprehensive website SEO analysis and recommendations</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SEO Analysis Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">SEO Analysis Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {isLoading ? 'Generating analysis...' : 'Complete website SEO analysis and recommendations'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Website</h3>
                    <p className="text-gray-600 text-center max-w-md">
                      We're analyzing your website's SEO performance, page speed, and providing recommendations...
                    </p>
                  </div>
                ) : seoData ? (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            {children}
                          </h3>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-2 my-4">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{children}</span>
                          </li>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-600">{children}</em>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{children}</pre>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 bg-green-50 py-2 rounded-r-lg">
                            {children}
                          </blockquote>
                        )
                      }}
                    >
                      {seoData.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Available</h3>
                    <p className="text-gray-600 mb-4">
                      Unable to generate SEO analysis. Please try again.
                    </p>
                    <Button
                      onClick={fetchSEOAnalysis}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Retry Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Status */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Analysis Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Page Speed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Excellent</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SEO Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-600">Good</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mobile Friendly</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Yes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0.7s</div>
                    <div className="text-sm text-green-700">First Contentful Paint</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1.5s</div>
                    <div className="text-sm text-blue-700">Largest Contentful Paint</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0ms</div>
                    <div className="text-sm text-purple-700">Total Blocking Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => router.push('/chatbot/create')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Bot
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => router.push('/dashboard')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
