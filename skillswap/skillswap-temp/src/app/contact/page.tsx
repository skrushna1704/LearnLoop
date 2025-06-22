'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  Globe,
  HelpCircle,
  Users,
  BookOpen,
  Shield,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  MessageCircle,
  FileText,
  Bug,
  Lightbulb,
  Heart
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email',
    contact: 'support@learnloop.com',
    responseTime: '< 24 hours',
    color: 'bg-blue-100 text-blue-600',
    available: true
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team',
    contact: 'Available 9 AM - 6 PM EST',
    responseTime: '< 5 minutes',
    color: 'bg-green-100 text-green-600',
    available: true
  },
  {
    icon: MessageCircle,
    title: 'Community Forum',
    description: 'Ask the community',
    contact: 'forum.learnloop.com',
    responseTime: '< 2 hours',
    color: 'bg-purple-100 text-purple-600',
    available: true
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Call our support line',
    contact: '+1 (555) 123-4567',
    responseTime: 'Business hours',
    color: 'bg-orange-100 text-orange-600',
    available: false
  }
];

const supportTopics = [
  { icon: Users, title: 'Account & Profile', description: 'Profile setup, verification, account issues' },
  { icon: BookOpen, title: 'Skill Exchanges', description: 'Finding partners, scheduling, session management' },
  { icon: Shield, title: 'Safety & Security', description: 'Reporting issues, privacy, safety guidelines' },
  { icon: Zap, title: 'Technical Issues', description: 'App bugs, connectivity, feature problems' },
  { icon: Heart, title: 'Community Guidelines', description: 'Platform rules, best practices, etiquette' },
  { icon: HelpCircle, title: 'General Questions', description: 'How it works, getting started, other inquiries' }
];

const faqs = [
  {
    question: 'How do I get started on LearnLoop?',
    answer: 'Getting started is easy! Create your profile, add the skills you can teach and want to learn, then browse our community to find perfect learning partners. Our matching algorithm will also suggest compatible users based on your interests.'
  },
  {
    question: 'Is LearnLoop really completely free?',
    answer: 'Yes! LearnLoop is 100% free with no hidden fees, subscriptions, or premium tiers. We believe education should be accessible to everyone, and our platform is supported by our community and partnerships.'
  },
  {
    question: 'How do I ensure safe exchanges?',
    answer: 'We have multiple safety measures including verified profiles, community ratings, secure messaging, and reporting systems. Always meet in public places for in-person exchanges and use our platform for all communications.'
  },
  {
    question: 'What if I can&apos;t find someone to exchange skills with?',
    answer: 'Our community is growing daily! You can post in our forum, join skill-specific groups, or wait for our matching algorithm to find new compatible partners. We also regularly host community events for networking.'
  },
  {
    question: 'Can I exchange multiple skills at once?',
    answer: 'Absolutely! You can be involved in multiple skill exchanges simultaneously. Many of our users teach several skills while learning others, creating a rich learning ecosystem.'
  },
  {
    question: 'How do you handle disputes or issues?',
    answer: 'We have a dedicated support team and community moderation system. If issues arise, you can report them through our platform, and we&apos;ll investigate and resolve them fairly and quickly.'
  }
];

const socialLinks = [
  { icon: Twitter, name: 'Twitter', url: '#', color: 'hover:text-blue-400' },
  { icon: Facebook, name: 'Facebook', url: '#', color: 'hover:text-blue-600' },
  { icon: Linkedin, name: 'LinkedIn', url: '#', color: 'hover:text-blue-700' },
  { icon: Github, name: 'GitHub', url: '#', color: 'hover:text-gray-800' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    urgent: false
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = () => {
    setSubmitStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', category: '', message: '', urgent: false });
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Need help? Have questions? Want to share feedback? We're here to support your learning journey.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Community Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Global Team</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>Multilingual Support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        {/* Contact Methods */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Preferred Way</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us - pick what works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                method.available 
                  ? 'border-gray-100 hover:shadow-lg cursor-pointer group' 
                  : 'border-gray-200 opacity-60'
              }`}>
                <div className={`w-12 h-12 rounded-xl ${method.color} mb-4 flex items-center justify-center ${
                  method.available ? 'group-hover:scale-110 transition-transform duration-300' : ''
                }`}>
                  <method.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="font-medium text-gray-900 mb-2">{method.contact}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Response: {method.responseTime}</span>
                  {method.available ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Coming Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We'll respond to your message within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitStatus(null)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a category</option>
                    <option value="account">Account & Profile</option>
                    <option value="exchanges">Skill Exchanges</option>
                    <option value="technical">Technical Issues</option>
                    <option value="safety">Safety & Security</option>
                    <option value="general">General Questions</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Please provide as much detail as possible to help us assist you better..."
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="urgent"
                    id="urgent"
                    checked={formData.urgent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700">
                    This is urgent and needs immediate attention
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitStatus === 'submitting'}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Support Topics & FAQ */}
          <div className="space-y-8">
            
            {/* Quick Help Topics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Help Topics</h3>
              <div className="space-y-3">
                {supportTopics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200 cursor-pointer group">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <topic.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {topic.title}
                      </h4>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.slice(0, 4).map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                View All FAQs
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest news, features, and community highlights
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}