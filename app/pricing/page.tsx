'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Check, Star, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS, APP_NAME, URLS } from '@/constants';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      ...SUBSCRIPTION_PLANS.FREE,
      icon: Star,
      color: 'from-slate-100 via-gray-100 to-slate-200',
      textColor: 'text-slate-600',
      buttonColor: 'bg-slate-600 hover:bg-slate-700',
      borderColor: 'border-slate-200',
      popular: false,
      description: 'Perfect for getting started with AI chatbots',
      additionalFeatures: [
        '1 chatbot',
        'Basic customization',
        'Email support',
        'Knowledge base up to 10 pages'
      ]
    },
    {
      id: 'pro',
      ...SUBSCRIPTION_PLANS.PRO,
      icon: Zap,
      color: 'from-blue-100 via-indigo-100 to-purple-100',
      textColor: 'text-blue-600',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      borderColor: 'border-blue-300',
      popular: true,
      description: 'Ideal for growing businesses and teams',
      additionalFeatures: [
        '5 chatbots',
        'Advanced customization',
        'Priority support',
        'Knowledge base up to 100 pages',
        'Analytics dashboard',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      ...SUBSCRIPTION_PLANS.ENTERPRISE,
      icon: Crown,
      color: 'from-amber-100 via-orange-100 to-yellow-100',
      textColor: 'text-amber-600',
      buttonColor: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      borderColor: 'border-amber-300',
      popular: false,
      description: 'For large organizations with advanced needs',
      additionalFeatures: [
        'Unlimited chatbots',
        'Complete white-label solution',
        'Dedicated account manager',
        'Unlimited knowledge base',
        'Advanced analytics & reporting',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment option'
      ]
    }
  ];

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    return billingCycle === 'yearly' ? Math.round(basePrice * 0.8 * 12) : basePrice;
  };

  const getPriceLabel = (basePrice: number) => {
    if (basePrice === 0) return 'Free forever';
    if (billingCycle === 'yearly') {
      return `$${getPrice(basePrice)}/year`;
    }
    return `$${basePrice}/month`;
  };

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
    },
    {
      question: "What happens if I exceed my monthly query limit?",
      answer: "If you exceed your monthly limit, your chatbot will temporarily pause until the next billing cycle, or you can upgrade to a higher plan."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund."
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Yes, Pro and Enterprise plans include custom domain support. You can embed chatbots on your own website with your branding."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. You only pay the monthly or yearly subscription fee."
    },
    {
      question: "Do you provide training and onboarding?",
      answer: "Enterprise customers get dedicated onboarding and training. Pro customers get priority email support and documentation."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href={URLS.HOME} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href={URLS.HOME}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors"
              >
                Back to Home
              </Link>
              <Link href={URLS.SIGNIN}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Choose the perfect plan for your business. Start free and scale as you grow with powerful AI chatbots.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16 animate-slideInUp">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-slate-200/60 shadow-sm">
              <div className="flex items-center">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    20% off
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative group transition-all duration-300 ${
                  plan.popular ? 'md:scale-105 z-10' : 'hover:scale-[1.02]'
                } animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`bg-white/70 backdrop-blur-sm rounded-2xl border-2 ${plan.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  hoveredPlan === plan.id ? 'shadow-2xl border-opacity-60' : ''
                } ${plan.popular ? 'border-blue-300 shadow-blue-100/50' : ''}`}>
                  
                  {/* Card Header */}
                  <div className={`p-8 bg-gradient-to-br ${plan.color} border-b border-slate-200/50`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-white/80 shadow-sm`}>
                        <plan.icon className={`w-6 h-6 ${plan.textColor}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{plan.name}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-800">
                          ${getPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-slate-600">
                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && plan.price > 0 && (
                        <p className="text-sm text-green-700 font-medium mt-1">
                          Save ${plan.price * 12 - getPrice(plan.price)} per year
                        </p>
                      )}
                    </div>
                    
                    <p className="text-slate-700 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Features List */}
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-semibold text-slate-800">
                          {plan.monthlyQueries.toLocaleString()} queries/month
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[...plan.features, ...plan.additionalFeatures].map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${plan.buttonColor} text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
                      asChild
                    >
                      <Link href={plan.price === 0 ? URLS.SIGNUP : URLS.SIGNUP}>
                        <span>{plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    
                    {plan.price > 0 && (
                      <p className="text-center text-xs text-slate-500 mt-3">
                        14-day free trial • No credit card required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using {APP_NAME} to provide 24/7 AI-powered customer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href={URLS.SIGNUP}>
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link href={URLS.HOME}>
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
