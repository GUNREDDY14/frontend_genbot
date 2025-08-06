'use client';

import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  BoltIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon
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
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div 
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="py-16 sm:py-24 lg:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl animate-fade-in">
                Create Intelligent{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  AI Chatbots
                </span>{' '}
                for Your Website
              </h1>
              <p className="mt-6 text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-muted-foreground animate-slide-up max-w-3xl mx-auto">
                Transform your website into a 24/7 customer support powerhouse. 
                GenBotAI automatically creates intelligent chatbots that understand your business 
                and help visitors instantly.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 animate-slide-up">
                <Link href="#demo" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                    Try the Bot
                  </Button>
                </Link>
                <Link href={URLS.SIGNUP} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Get Started <span aria-hidden="true">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Features Section */}
      <section id="features" className="section-spacing bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-sm font-semibold leading-7 text-primary uppercase tracking-wide mb-4">
              Everything you need
            </h2>
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-6">
              Powerful AI chatbots made simple
            </h3>
            <p className="text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it incredibly easy to create, customize, and deploy intelligent 
              chatbots that understand your business and delight your customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="feature-card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon 
                      className="h-5 w-5 text-primary" 
                      aria-hidden="true" 
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {feature.name}
                    </h4>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-spacing bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-sm font-semibold leading-7 text-primary uppercase tracking-wide mb-4">
              Perfect for any business
            </h2>
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-6">
              Chatbots that work for your industry
            </h3>
            <p className="text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re in e-commerce, SaaS, or services, our AI chatbots adapt to your unique business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {useCases.map((useCase, index) => (
              <div 
                key={useCase.title} 
                className="group bg-background rounded-xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Demo Section */}
      <section id="demo" className="section-spacing bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-6">
              See it in action
            </h2>
            <p className="text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground max-w-2xl mx-auto">
              Try our demo chatbot and experience how easy it is to interact with an AI assistant 
              that knows your business.
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              {/* Chat Interface */}
              <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">GenBotAI Demo</h3>
                      <p className="text-xs text-white/80">Online now</p>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="p-6 space-y-4 min-h-[300px] bg-muted/20">
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">AI</span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-border">
                        <p className="text-sm text-foreground">
                          Hi! I&apos;m your AI assistant. How can I help you today?
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-primary rounded-2xl rounded-tr-md p-4 shadow-sm max-w-[80%]">
                      <p className="text-sm text-white">
                        What services do you offer?
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">AI</span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-border">
                        <p className="text-sm text-foreground">
                          We help businesses create intelligent AI chatbots for their websites. 
                          Our platform makes it easy to provide 24/7 customer support! 
                          Would you like to see how to get started?
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Typing Indicator */}
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">AI</span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-border">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Input */}
                <div className="border-t border-border p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted/50 rounded-full px-4 py-2">
                      <p className="text-sm text-muted-foreground">Type your message...</p>
                    </div>
                    <button className="bg-primary hover:bg-primary-hover p-2 rounded-full transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl mb-6">
              Ready to boost your customer experience?
            </h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-white/90 mb-8">
              Join thousands of businesses using GenBotAI to provide instant, intelligent customer support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href={URLS.SIGNUP} className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href={URLS.PRICING} className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  View Pricing <span aria-hidden="true">→</span>
                </Button>
              </Link>
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
              <p className="text-muted-foreground max-w-md leading-relaxed">
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