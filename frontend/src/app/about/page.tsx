'use client';

import React from 'react';
import {
  Users,
  Globe,
  Heart,
  Zap,
  Target,
  BookOpen,
  Award,
  Lightbulb,
  Rocket,
  Star,
  ArrowRight,
  Check,
  TrendingUp,
  MessageSquare,
  Calendar,
  Shield,
  Sparkles,
  Building,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Members', value: '50,000+', color: 'text-blue-600' },
  { icon: Globe, label: 'Countries', value: '120+', color: 'text-green-600' },
  { icon: BookOpen, label: 'Skills Available', value: '2,500+', color: 'text-purple-600' },
  { icon: Award, label: 'Exchanges Completed', value: '125,000+', color: 'text-orange-600' }
];

const features = [
  {
    icon: Heart,
    title: 'Completely Free',
    description: 'No hidden fees, no subscriptions. Learning and teaching should be accessible to everyone.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Shield,
    title: 'Safe & Verified',
    description: 'Verified profiles, secure messaging, and community-driven trust system.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connect with learners and teachers from around the world, anytime.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Smart algorithm matches you with compatible learning partners.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Set learning goals, track progress, and celebrate achievements.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Sparkles,
    title: 'Quality Focused',
    description: 'Rating system ensures high-quality exchanges and continuous improvement.',
    color: 'bg-pink-100 text-pink-600'
  }
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'Co-Founder & CEO',
    bio: 'Former education technology executive passionate about democratizing learning',
    avatar: 'https://i.pravatar.cc/150?img=1',
    skills: ['Leadership', 'EdTech', 'Strategy']
  },
  {
    name: 'Michael Rodriguez',
    role: 'Co-Founder & CTO',
    bio: 'Full-stack developer and AI enthusiast building the future of peer learning',
    avatar: 'https://i.pravatar.cc/150?img=2',
    skills: ['AI/ML', 'Full Stack', 'Product']
  },
  {
    name: 'Emma Thompson',
    role: 'Head of Community',
    bio: 'Community builder focused on creating inclusive and supportive learning environments',
    avatar: 'https://i.pravatar.cc/150?img=3',
    skills: ['Community', 'Marketing', 'Growth']
  },
  {
    name: 'David Kim',
    role: 'Lead Designer',
    bio: 'UX designer crafting intuitive experiences that make learning joyful',
    avatar: 'https://i.pravatar.cc/150?img=4',
    skills: ['UI/UX', 'Design Systems', 'Research']
  }
];

const values = [
  {
    title: 'Accessibility First',
    description: 'Education should be free and accessible to everyone, regardless of background or location.',
    icon: Globe
  },
  {
    title: 'Community Driven',
    description: 'Our platform thrives on the generosity and knowledge of our amazing community.',
    icon: Users
  },
  {
    title: 'Quality Learning',
    description: 'We believe in meaningful exchanges that create lasting impact and real skill development.',
    icon: Award
  },
  {
    title: 'Innovation',
    description: 'Continuously improving our platform with cutting-edge technology and user feedback.',
    icon: Rocket
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">LearnLoop</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              We&apos;re building the world&apos;s largest peer-to-peer learning community where knowledge flows freely 
              and everyone has the opportunity to teach and learn.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Founded in 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Global Headquarters</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>100% Free Platform</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} ${stat.color} mx-auto mb-4 flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              To democratize learning by connecting people globally to exchange skills, 
              breaking down barriers to education and creating economic opportunities 
              without traditional monetary transactions.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Vision
                </h3>
                <p className="text-gray-600">
                  A world where everyone has access to quality education and the opportunity 
                  to share their knowledge, regardless of economic circumstances.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Impact
                </h3>
                <p className="text-gray-600">
                  Empowering millions of learners worldwide while creating meaningful 
                  connections and fostering a culture of knowledge sharing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LearnLoop?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built a platform that puts learners first, ensuring everyone can access 
              high-quality education and meaningful teaching opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${feature.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How LearnLoop Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple three-step process makes it easy to start learning and teaching
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Add your skills, set your availability, and tell us what you'd like to learn
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Your Match</h3>
              <p className="text-gray-600">
                Our smart algorithm connects you with compatible learning partners worldwide
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Exchanging</h3>
              <p className="text-gray-600">
                Schedule sessions, exchange knowledge, and grow together in our supportive community
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at LearnLoop
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate educators, technologists, and community builders working to democratize learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of learners and teachers who are already transforming their lives through skill exchange
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
              Learn More
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}