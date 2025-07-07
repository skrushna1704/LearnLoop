'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  Shield,
  Star,
  Lightbulb,
  Award,
  MessageSquare,
  Download,
  Clock,
  Eye,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Rocket,
  TrendingUp,
  Tag,
  Bookmark,
  Share2,
  Plus
} from 'lucide-react';

const resourceCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Everything you need to begin your LearnLoop journey',
    icon: Rocket,
    color: 'bg-blue-100 text-blue-600',
    count: 12
  },
  {
    id: 'learning-guides',
    name: 'Learning Guides',
    description: 'Comprehensive guides for effective learning',
    icon: BookOpen,
    color: 'bg-green-100 text-green-600',
    count: 18
  },
  {
    id: 'teaching-tips',
    name: 'Teaching Tips',
    description: 'Best practices for effective teaching',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-600',
    count: 15
  },
  {
    id: 'safety-guidelines',
    name: 'Safety & Guidelines',
    description: 'Community safety and platform guidelines',
    icon: Shield,
    color: 'bg-red-100 text-red-600',
    count: 8
  },
  {
    id: 'success-stories',
    name: 'Success Stories',
    description: 'Inspiring stories from our community',
    icon: Award,
    color: 'bg-purple-100 text-purple-600',
    count: 25
  },
  {
    id: 'faqs',
    name: 'FAQs',
    description: 'Frequently asked questions and answers',
    icon: HelpCircle,
    color: 'bg-orange-100 text-orange-600',
    count: 30
  }
];

const featuredResources = [
  {
    id: 1,
    title: 'Complete Beginner\'s Guide to LearnLoop',
    description: 'Everything you need to know to get started with skill exchange, from creating your profile to scheduling your first session.',
    type: 'guide',
    category: 'Getting Started',
    readTime: '15 min read',
    views: 15420,
    likes: 892,
    difficulty: 'Beginner',
    author: 'LearnLoop Team',
    publishDate: '2024-01-15',
    featured: true,
    tags: ['beginner', 'setup', 'profile', 'first-steps']
  },
  {
    id: 2,
    title: 'How to Be an Effective Online Teacher',
    description: 'Master the art of online teaching with practical tips, best practices, and proven strategies for engaging virtual learners.',
    type: 'guide',
    category: 'Teaching Tips',
    readTime: '12 min read',
    views: 8950,
    likes: 634,
    difficulty: 'Intermediate',
    author: 'Sarah Chen',
    publishDate: '2024-02-20',
    featured: true,
    tags: ['teaching', 'online', 'engagement', 'best-practices']
  },
  {
    id: 3,
    title: 'Setting Boundaries in Skill Exchange',
    description: 'Learn how to maintain healthy boundaries while building meaningful learning relationships in our community.',
    type: 'guide',
    category: 'Safety & Guidelines',
    readTime: '8 min read',
    views: 12340,
    likes: 756,
    difficulty: 'Beginner',
    author: 'Community Team',
    publishDate: '2024-03-10',
    featured: true,
    tags: ['safety', 'boundaries', 'communication', 'community']
  }
];

const quickLinks = [
  { name: 'Platform Overview', icon: Info, href: '#' },
  { name: 'Community Guidelines', icon: Shield, href: '#' },
  { name: 'Getting Started Checklist', icon: CheckCircle, href: '#' },
  { name: 'Troubleshooting Guide', icon: AlertCircle, href: '#' },
  { name: 'Contact Support', icon: MessageSquare, href: '#' },
  { name: 'Feature Requests', icon: Lightbulb, href: '#' }
];

const popularResources = [
  {
    title: 'How to Choose the Right Learning Partner',
    type: 'article',
    views: 24680,
    category: 'Learning Guides'
  },
  {
    title: 'Creating Engaging Lesson Plans',
    type: 'template',
    downloads: 8920,
    category: 'Teaching Tips'
  },
  {
    title: 'Video Call Best Practices',
    type: 'guide',
    views: 18540,
    category: 'Teaching Tips'
  },
  {
    title: 'Building Trust in Online Learning',
    type: 'article',
    views: 15670,
    category: 'Safety & Guidelines'
  },
  {
    title: 'Overcoming Language Barriers',
    type: 'guide',
    views: 12890,
    category: 'Learning Guides'
  }
];

const faqs = [
  {
    question: 'How do I get started on LearnLoop?',
    answer: 'Getting started is easy! First, create your free account and complete your profile. Add the skills you can teach and list what you\'d like to learn. Then browse our community to find learning partners or wait for our matching algorithm to suggest compatible users.',
    category: 'Getting Started'
  },
  {
    question: 'How do I find the right teacher for my needs?',
    answer: 'Use our advanced search and filtering options to find teachers by skill, location, rating, and availability. Read their profiles, teaching approaches, and student reviews. You can also post a learning request and let teachers reach out to you.',
    category: 'Learning'
  },
  {
    question: 'What makes a successful skill exchange?',
    answer: 'Successful exchanges are built on clear communication, mutual respect, and consistent commitment. Set clear goals, maintain regular sessions, provide constructive feedback, and remember that both teaching and learning require patience and practice.',
    category: 'Teaching'
  },
  {
    question: 'How do I ensure my safety while using LearnLoop?',
    answer: 'Always use our platform for initial communications, meet in public places for in-person sessions, trust your instincts, and report any concerning behavior. We have community guidelines and safety measures in place to protect all users.',
    category: 'Safety'
  },
  {
    question: 'Can I exchange multiple skills at the same time?',
    answer: 'Yes! Many users are involved in multiple skill exchanges simultaneously. You can teach several different skills while learning others, creating a rich and diverse learning experience.',
    category: 'Platform'
  },
  {
    question: 'How do I handle disputes or issues with exchanges?',
    answer: 'If issues arise, first try to communicate directly with your exchange partner. If that doesn\'t resolve the problem, contact our support team through the platform. We have mediation processes and community guidelines to help resolve conflicts fairly.',
    category: 'Support'
  }
];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('all');

  const faqCategories = ['all', 'Getting Started', 'Learning', 'Teaching', 'Safety', 'Platform', 'Support'];

  const filteredFaqs = selectedFaqCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedFaqCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Learning <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Resource Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Everything you need to succeed in your skill exchange journey. From getting started guides 
              to advanced teaching strategies, we&apos;ve got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-200 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search guides, FAQs, tips, and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-green-200 focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg"
                />
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">120+</div>
                <div className="text-sm text-green-100">Guides & Articles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-green-100">Video Tutorials</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">30+</div>
                <div className="text-sm text-green-100">Templates</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-green-100">Support Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex flex-col items-center p-4 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <link.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-300">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Featured Resources */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Resources</h2>
              <p className="text-gray-600">Hand-picked content to help you succeed</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                
                {/* Resource Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {resource.difficulty}
                    </span>
                    {resource.featured && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {resource.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {(resource.views || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {resource.likes || 0}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(resource.tags || []).slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Author and Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">By {resource.author || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">{resource.publishDate || 'No date'}</span>
                  </div>
                </div>
                
                {/* Action Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">{resource.category || 'Uncategorized'}</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm font-medium">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find exactly what you need with our organized resource categories
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className={`w-16 h-16 rounded-2xl ${category.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium">{category.count} resources</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Resources */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular This Week</h2>
              <p className="text-gray-600">Most viewed and downloaded resources</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          
          <div className="space-y-4">
            {popularResources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {resource.category || 'Uncategorized'}
                      </span>
                      <span className="flex items-center gap-1">
                        {resource.type === 'template' ? (
                          <>
                            <Download className="w-3 h-3" />
                            {(resource.downloads || 0).toLocaleString()} downloads
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            {(resource.views || 0).toLocaleString()} views
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about LearnLoop
            </p>
          </div>
          
          {/* FAQ Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFaqCategory(category)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                  selectedFaqCategory === category
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Can&apos;t Find What You Need?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Our community and support team are here to help. Ask a question, suggest new content, 
            or connect with fellow learners in our forums.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
              <MessageSquare className="w-5 h-5" />
              Ask Community
            </button>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
              <Plus className="w-5 h-5" />
              Suggest Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}