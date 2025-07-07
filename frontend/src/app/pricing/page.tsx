'use client';

import React from 'react';
import Image from 'next/image';
import {
  Check,
  Star,
  Heart,
  Users,
  Globe,
  Zap,
  Shield,
  BookOpen,
  TrendingUp,
  Infinity,
  Gift,
  Sparkles,
  DollarSign,
  ArrowRight,
  HelpCircle,
  Crown,
  Rocket
} from 'lucide-react';

const features = [
  {
    category: 'Core Learning Features',
    items: [
      { name: 'Unlimited skill exchanges', included: true },
      { name: 'Global community access', included: true },
      { name: 'Smart skill matching', included: true },
      { name: 'Secure messaging system', included: true },
      { name: 'Video call integration', included: true },
      { name: 'Session scheduling', included: true },
      { name: 'Progress tracking', included: true },
      { name: 'Achievement badges', included: true }
    ]
  },
  {
    category: 'Community & Support',
    items: [
      { name: 'Community forums access', included: true },
      { name: '24/7 community support', included: true },
      { name: 'Safety & verification system', included: true },
      { name: 'Dispute resolution', included: true },
      { name: 'Multi-language support', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Email support', included: true },
      { name: 'Learning resources library', included: true }
    ]
  },
  {
    category: 'Advanced Features',
    items: [
      { name: 'Advanced analytics dashboard', included: true },
      { name: 'Custom learning goals', included: true },
      { name: 'Skill certification system', included: true },
      { name: 'Group learning sessions', included: true },
      { name: 'Expert-led workshops', included: true },
      { name: 'Premium learning content', included: true },
      { name: 'Priority customer support', included: true },
      { name: 'API access for developers', included: true }
    ]
  }
];

const comparisons = [
  {
    platform: 'LearnLoop',
    price: 'Free Forever',
    model: 'Peer-to-peer exchange',
    courses: 'Unlimited',
    interaction: 'One-on-one & groups',
    certification: 'Community verified',
    support: '24/7 community',
    highlight: true
  },
  {
    platform: 'Traditional Platforms',
    price: '$29-99/month',
    model: 'Subscription based',
    courses: 'Limited by tier',
    interaction: 'Pre-recorded videos',
    certification: 'Platform certificates',
    support: 'Email only'
  },
  {
    platform: 'Private Tutoring',
    price: '$50-200/hour',
    model: 'Pay per session',
    courses: 'Single skill focus',
    interaction: 'One-on-one only',
    certification: 'None typically',
    support: 'Tutor dependent'
  },
  {
    platform: 'Bootcamps',
    price: '$5,000-20,000',
    model: 'Intensive programs',
    courses: 'Fixed curriculum',
    interaction: 'Classroom style',
    certification: 'Program certificate',
    support: 'During program only'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Developer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    quote: 'I learned UI design while teaching React. The value exchange is incredible - I saved thousands while gaining real skills.',
    savings: '$2,400',
    skillsLearned: 3
  },
  {
    name: 'Miguel Santos',
    role: 'Graphic Designer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    quote: 'Traditional courses cost me $500+ per skill. Here I&apos;ve learned 5 skills for free by sharing my design expertise.',
    savings: '$3,200',
    skillsLearned: 5
  },
  {
    name: 'Emma Thompson',
    role: 'Marketing Manager',
    avatar: 'https://i.pravatar.cc/150?img=3',
    quote: 'The community aspect is priceless. I&apos;ve made lifelong connections while mastering new skills completely free.',
    savings: '$1,800',
    skillsLearned: 4
  }
];

const valueProps = [
  {
    icon: Heart,
    title: 'Community Driven',
    description: 'Built by learners, for learners. Our community believes in sharing knowledge freely.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Learn from experts worldwide without geographical or financial barriers.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Zap,
    title: 'Real-Time Learning',
    description: 'Interactive, personalized learning that adapts to your pace and style.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified community with robust safety measures and dispute resolution.',
    color: 'bg-green-100 text-green-600'
  }
];

const stats = [
  { value: '$0', label: 'Platform Cost', icon: DollarSign },
  { value: '∞', label: 'Learning Limit', icon: Infinity },
  { value: '50k+', label: 'Community Members', icon: Users },
  { value: '120+', label: 'Countries', icon: Globe }
];

export default function PricingPage() {
  const totalSavings = testimonials.reduce((sum, testimonial) => 
    sum + parseInt(testimonial.savings.replace('$', '').replace(',', '')), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-green-100 mb-6">
              <Gift className="w-5 h-5" />
              <span className="font-medium">100% Free Forever</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Learning Should Be <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Free</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              No subscriptions, no hidden fees, no paywalls. Just pure knowledge exchange 
              in a community that believes education is a human right.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-green-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Value Propositions */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Free Works Better</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional education creates barriers. We remove them by building a community 
              where knowledge flows freely in both directions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group text-center">
                <div className={`w-16 h-16 rounded-2xl ${prop.color} mb-6 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <prop.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{prop.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free Plan Details */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8 text-white text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Forever Free Plan</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">$0 / Forever</h2>
            <p className="text-green-100 text-lg mb-6">
              Everything you need to learn and teach skills in our global community
            </p>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Features List */}
          <div className="p-8">
            <div className="space-y-8">
              {features.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    {category.category}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Compare</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how LearnLoop stacks up against traditional learning platforms
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Platform</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Pricing</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Learning Model</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Course Access</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Interaction</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Support</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((platform, index) => (
                    <tr key={index} className={`border-b border-gray-100 ${
                      platform.highlight ? 'bg-green-50 ring-2 ring-green-200' : 'hover:bg-gray-50'
                    }`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {platform.highlight && (
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                          )}
                          <span className={`font-semibold ${platform.highlight ? 'text-green-900' : 'text-gray-900'}`}>
                            {platform.platform}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${platform.highlight ? 'text-green-600' : 'text-gray-700'}`}>
                          {platform.price}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{platform.model}</td>
                      <td className="py-4 px-6 text-gray-600">{platform.courses}</td>
                      <td className="py-4 px-6 text-gray-600">{platform.interaction}</td>
                      <td className="py-4 px-6 text-gray-600">{platform.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Community Savings */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Community Savings Impact</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Our members have saved thousands while gaining valuable skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-purple-100 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-purple-100 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{testimonial.savings}</div>
                    <div className="text-purple-200 text-sm">Money Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{testimonial.skillsLearned}</div>
                    <div className="text-purple-200 text-sm">Skills Learned</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">
                Total Community Savings: ${totalSavings.toLocaleString()}+
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our free platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  How is LearnLoop completely free?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We&apos;re community-funded and believe in the gift economy model. By enabling skill exchange 
                  rather than monetary transactions, we create value without traditional business costs.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Will there ever be premium features?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our core learning platform will always be free. We may introduce optional enterprise 
                  features for organizations, but individual learners will never pay.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  How do you ensure quality without payment?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our community-driven rating system, peer verification, and mutual accountability 
                  ensure high-quality exchanges. When both parties invest time, they&apos;re motivated to deliver value.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  What if I don&apos;t have skills to teach?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Everyone has something valuable to share! Whether it&apos;s a language, life experience, 
                  hobby, or professional skill - our community helps you identify and develop your teaching abilities.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  How does this compare to paid platforms?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Unlike passive video courses, LearnLoop offers personalized, interactive learning with 
                  real feedback. You learn by doing and teaching, creating deeper understanding and lasting connections.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Can I really learn professional skills for free?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely! Our community includes professionals from all industries sharing real-world 
                  expertise. Many members have changed careers using skills learned on LearnLoop.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Start Learning Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our global community and discover the power of free, peer-to-peer learning. 
              No credit card required, no commitments, just pure knowledge exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg">
                Join LearnLoop Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                Browse Skills
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}