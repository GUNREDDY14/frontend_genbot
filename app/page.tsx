'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  BoltIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  PlayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/ui/Navigation';
import { APP_NAME, URLS } from '@/constants';

const features = [
  {
    name: 'Instant Customer Support',
    description: 'Help customers find products and information 24/7 without human intervention.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Easy Integration',
    description: 'Copy and paste a simple embed code to add your chatbot to any website.',
    icon: CursorArrowRaysIcon,
  },
  {
    name: 'Lightning Fast Setup',
    description: 'Get your AI chatbot up and running in minutes, not hours or days.',
    icon: BoltIcon,
  },
  {
    name: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Smart Learning',
    description: 'Your chatbot learns from your website content to provide accurate, relevant answers.',
    icon: ClockIcon,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track conversations, user satisfaction, and identify areas for improvement.',
    icon: ChartBarIcon,
  },
];

const useCases = [
  {
    title: 'E-commerce',
    description: 'Help customers find products, answer questions about shipping, and boost conversions.',
  },
  {
    title: 'SaaS Companies',
    description: 'Provide instant support, guide users through features, and reduce support tickets.',
  },
  {
    title: 'Service Businesses',
    description: 'Qualify leads, answer FAQs, and schedule appointments automatically.',
  },
];

export default function HomePage() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.getAttribute('data-message-index') === '0') {
          const animateMessages = () => {
            for (let i = 0; i < 4; i++) {
              setTimeout(() => {
                setVisibleMessages(prev => {
                  if (!prev.includes(i)) {
                    return [...prev, i];
                  }
                  return prev;
                });
              }, i * 800);
            }
          };
          
          if (visibleMessages.length === 0) {
            animateMessages();
          }
        }
      });
    }, observerOptions);

    messageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Enhanced Hero Section */}
      <div className="relative isolate pt-14 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative py-20 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-slideInUp">
                <SparklesIcon className="w-4 h-4" />
                <span>✨ AI-Powered Customer Support</span>
                <SparklesIcon className="w-4 h-4" />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-fadeIn">
                Create Intelligent{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-glow">
                    AI Chatbots
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full opacity-30 animate-pulse"></div>
                </span>{' '}
                <br className="hidden sm:block" />
                for Your Website
              </h1>

              <p className="mt-8 text-lg sm:text-xl md:text-2xl leading-8 sm:leading-9 text-muted-foreground animate-slideInUp max-w-4xl mx-auto">
                Transform your website into a <span className="font-semibold text-primary">24/7 customer support powerhouse</span>. 
                GenBotAI automatically creates intelligent chatbots that understand your business 
                and <span className="font-semibold text-secondary">delight your customers instantly</span>.
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">&lt;2s</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
                <Link href="#demo" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Try Live Demo
                  </Button>
                </Link>
                <Link href={URLS.SIGNUP} className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto h-14 px-8 text-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Free
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-col items-center animate-slideInUp" style={{ animationDelay: '0.7s' }}>
                <p className="text-sm text-muted-foreground mb-4">Trusted by 10,000+ businesses worldwide</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-foreground">4.9/5 from 2,500+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-slideInUp">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Everything you need</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6 animate-fadeIn">
              Powerful AI chatbots{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                made simple
              </span>
            </h2>
            <p className="text-lg sm:text-xl leading-8 sm:leading-9 text-muted-foreground max-w-3xl mx-auto animate-slideInUp">
              Our platform makes it incredibly easy to create, customize, and deploy intelligent 
              chatbots that understand your business and <span className="font-semibold text-primary">delight your customers</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 transform hover:-translate-y-2 animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon 
                        className="h-7 w-7 text-primary group-hover:text-secondary transition-colors duration-300" 
                        aria-hidden="true" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center animate-slideInUp" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-primary/20">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Ready to get started?</span>
              <Link href={URLS.SIGNUP} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Create your bot now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Use Cases Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%2020c0%204.4-3.6%208-8%208s-8-3.6-8-8%203.6-8%208-8%208%203.6%208%208zm0-20c0%204.4-3.6%208-8%208s-8-3.6-8-8%203.6-8%208-8%208%203.6%208%208z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 text-emerald-600 text-sm font-medium mb-6 animate-slideInUp">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Perfect for any business</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6 animate-fadeIn">
              Chatbots that work for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                your industry
              </span>
            </h2>
            <p className="text-lg sm:text-xl leading-8 sm:leading-9 text-muted-foreground max-w-3xl mx-auto animate-slideInUp">
              Whether you're in e-commerce, SaaS, or services, our AI chatbots adapt to your unique business needs 
              and <span className="font-semibold text-emerald-600">drive real results</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {useCases.map((useCase, index) => (
              <div 
                key={useCase.title} 
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2 animate-slideInUp overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Number Badge */}
                <div className="relative mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                </div>
                
                <div className="relative">
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base mb-6">
                    {useCase.description}
                  </p>
                  
                  {/* Benefits List */}
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Instant setup</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>24/7 availability</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Increased conversions</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Success Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slideInUp" style={{ animationDelay: '0.6s' }}>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Faster Response Time</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
              <div className="text-sm text-muted-foreground">Reduced Support Tickets</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Higher Conversion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Demo Section */}
      <section id="demo" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-600 text-sm font-medium mb-6 animate-slideInUp">
              <PlayIcon className="w-4 h-4" />
              <span>Live Demo</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6 animate-fadeIn">
              See it in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                action
              </span>
            </h2>
            <p className="text-lg sm:text-xl leading-8 sm:leading-9 text-muted-foreground max-w-3xl mx-auto animate-slideInUp">
              Try our demo chatbot and experience how easy it is to interact with an AI assistant 
              that <span className="font-semibold text-blue-600">knows your business</span> inside and out.
            </p>
          </div>
          
          <div className="mx-auto max-w-3xl">
            <div className="relative animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              {/* Floating Elements Around Chat */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-purple-200 rounded-full animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
              <div className="absolute -bottom-4 -left-2 w-4 h-4 bg-indigo-200 rounded-full animate-ping opacity-60" style={{ animationDelay: '3s' }}></div>
              
              {/* Enhanced Chat Interface */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 px-6 py-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">GenBotAI Demo</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-sm text-white/90">Online • Typically replies instantly</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Chat Messages */}
                <div className="p-8 space-y-6 min-h-[400px] bg-gradient-to-b from-gray-50/50 to-white" ref={chatSectionRef}>
                  {/* Message 1 - AI Greeting */}
                  <div 
                    ref={(el) => { messageRefs.current[0] = el; }}
                    data-message-index="0"
                    className={`flex justify-start transition-all duration-600 ${
                      visibleMessages.includes(0) ? 'chat-message-visible' : 'chat-message-hidden'
                    }`}
                  >
                    <div className="flex items-start gap-4 chat-message max-w-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <SparklesIcon className="text-white w-5 h-5" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <p className="text-sm text-foreground leading-relaxed">
                          👋 Hi there! I'm your AI assistant. How can I help you today?
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">Just now</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message 2 - User Question */}
                  <div 
                    ref={(el) => { messageRefs.current[1] = el; }}
                    data-message-index="1"
                    className={`flex justify-end transition-all duration-600 ${
                      visibleMessages.includes(1) ? 'chat-message-visible' : 'chat-message-hidden'
                    }`}
                  >
                    <div className="max-w-md">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl rounded-tr-md p-4 shadow-lg chat-message">
                        <p className="text-sm text-white leading-relaxed">
                          What services do you offer? I'm looking for customer support solutions.
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 text-right">Just now</div>
                    </div>
                  </div>
                  
                  {/* Message 3 - AI Response */}
                  <div 
                    ref={(el) => { messageRefs.current[2] = el; }}
                    data-message-index="2"
                    className={`flex justify-start transition-all duration-600 ${
                      visibleMessages.includes(2) ? 'chat-message-visible' : 'chat-message-hidden'
                    }`}
                  >
                    <div className="flex items-start gap-4 chat-message max-w-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <SparklesIcon className="text-white w-5 h-5" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <p className="text-sm text-foreground leading-relaxed">
                          🚀 We help businesses create intelligent AI chatbots for their websites! 
                          Our platform makes it easy to provide 24/7 customer support with instant responses. 
                          Would you like to see how to get started?
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">Just now</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message 4 - Typing Indicator */}
                  <div 
                    ref={(el) => { messageRefs.current[3] = el; }}
                    data-message-index="3"
                    className={`flex justify-start transition-all duration-600 ${
                      visibleMessages.includes(3) ? 'chat-message-visible' : 'chat-message-hidden'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <SparklesIcon className="text-white w-5 h-5" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-lg border border-gray-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:400ms]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Chat Input */}
                <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <div className="bg-gray-100 rounded-2xl px-5 py-3 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                        <p className="text-sm text-muted-foreground">Try asking: "How does your chatbot work?"</p>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
                          <SparklesIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Powered by SmartAssist AI</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Try It Button */}
              <div className="mt-8 text-center">
                <Link href={URLS.SIGNUP}>
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Try It Yourself - It's Free!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 animate-slideInUp backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4" />
              <span>Join 10,000+ Happy Customers</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-6xl mb-6 animate-fadeIn">
              Ready to boost your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                customer experience
              </span>
              ?
            </h2>
            
            <p className="mx-auto max-w-3xl text-lg sm:text-xl leading-8 sm:leading-9 text-white/90 mb-12 animate-slideInUp">
              Join thousands of businesses using GenBotAI to provide instant, intelligent customer support. 
              <span className="font-semibold text-yellow-200">Start your free trial today</span> - no credit card required!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200 mb-1">30 sec</div>
                <div className="text-sm text-white/80">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200 mb-1">Free</div>
                <div className="text-sm text-white/80">Forever Plan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200 mb-1">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
              <Link href={URLS.SIGNUP} className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href={URLS.PRICING} className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
                >
                  View Pricing
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="mt-12 flex flex-col items-center animate-slideInUp" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                ))}
              </div>
              <p className="text-white/80 text-sm">
                "GenBotAI increased our customer satisfaction by 40%" - Sarah, CEO at TechCorp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <span className="text-2xl font-bold text-primary mb-4 block">{APP_NAME}</span>
              <p className="text-muted-foreground max-w-md leading-relaxed allow-break">
                Intelligent AI chatbots for your website. Transform your customer support with 24/7 AI assistance that understands your business.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <div className="space-y-3">
                <Link href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href={URLS.PRICING} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="#demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Demo
                </Link>
              </div>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <div className="space-y-3">
                <Link href="#about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="#contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                <Link href="#support" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground">
                &copy; 2025 {APP_NAME}. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="#privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}