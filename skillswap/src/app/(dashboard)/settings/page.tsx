'use client';

import React, { useState } from 'react';
import { 
  Bell,
  Lock,
  Globe,
  Shield,
  Mail,
  Smartphone,
  Moon,
  Sun,
  LogOut,
  Trash2,
  User,
  CreditCard,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Clock,
  Languages,
  Palette,
  Download,
  Upload,
  Key,
  Wifi,
  Volume2,
  VolumeX,
  Check,
  X,
  ChevronRight,
  Star,
  HelpCircle,
  FileText,
  MessageSquare,
  Settings as SettingsIcon,
  Save
} from 'lucide-react';

const settingsSections = [
  {
    id: 'account',
    title: 'Account Settings',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    items: [
      {
        id: 'profile',
        title: 'Profile Information',
        description: 'Update your personal information and public profile',
        action: 'Edit',
        current: 'Complete'
      },
      {
        id: 'password',
        title: 'Password & Security',
        description: 'Change your password and security settings',
        action: 'Change',
        current: 'Strong'
      },
      {
        id: 'email',
        title: 'Email Preferences',
        description: 'Manage your email notifications and communication',
        action: 'Configure',
        current: 'Weekly digest'
      },
      {
        id: 'timezone',
        title: 'Time Zone & Location',
        description: 'Set your timezone and location preferences',
        action: 'Update',
        current: 'UTC+5:30 (Mumbai)'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    items: [
      {
        id: 'privacy',
        title: 'Privacy Settings',
        description: 'Control who can see your profile and activity',
        action: 'Manage',
        current: 'Public profile'
      },
      {
        id: '2fa',
        title: 'Two-Factor Authentication',
        description: 'Add an extra layer of security to your account',
        action: 'Enable',
        current: 'Disabled'
      },
      {
        id: 'sessions',
        title: 'Active Sessions',
        description: 'Manage your active sessions and devices',
        action: 'View',
        current: '3 active devices'
      },
      {
        id: 'data',
        title: 'Data & Download',
        description: 'Download your data or request account deletion',
        action: 'Access',
        current: 'Available'
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    items: [
      {
        id: 'push',
        title: 'Push Notifications',
        description: 'Configure your push notification preferences',
        action: 'Settings',
        current: 'Enabled'
      },
      {
        id: 'email-notif',
        title: 'Email Notifications',
        description: 'Manage your email notification settings',
        action: 'Configure',
        current: 'Important only'
      },
      {
        id: 'sms',
        title: 'SMS Notifications',
        description: 'Set up SMS notifications for important updates',
        action: 'Setup',
        current: 'Not configured'
      }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance & Language',
    icon: Palette,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    items: [
      {
        id: 'theme',
        title: 'Theme Preferences',
        description: 'Choose between light, dark, or system theme',
        action: 'Change',
        current: 'Light mode'
      },
      {
        id: 'language',
        title: 'Language & Region',
        description: 'Set your preferred language and regional settings',
        action: 'Update',
        current: 'English (US)'
      },
      {
        id: 'accessibility',
        title: 'Accessibility',
        description: 'Configure accessibility and display options',
        action: 'Configure',
        current: 'Default'
      }
    ]
  }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const currentUser = {
    name: 'Shrikrushna Gaikwad',
    email: 'shrikrushna@LearnLoop.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shrikrushna',
    verified: true,
    plan: 'Premium',
    joinDate: 'January 2024'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-3xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
                <p className="text-gray-300 text-lg">Manage your account preferences and privacy settings</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Member since</div>
                  <div className="font-semibold">{currentUser.joinDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Current plan</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{currentUser.plan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              {currentUser.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Star className="w-3 h-3 text-white fill-current" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{currentUser.name}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentUser.plan} Member
                </span>
              </div>
              <p className="text-gray-600 mb-4">{currentUser.email}</p>
              
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300">
                  <User className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                  <Eye className="w-4 h-4" />
                  View Public Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
              <nav className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      activeSection === section.id
                        ? `${section.bgColor} ${section.color} shadow-sm`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                      activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {settingsSections.map((section) => {
              if (activeSection !== section.id) return null;
              
              return (
                <div key={section.id} className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Section Header */}
                    <div className={`${section.bgColor} p-6 border-b border-gray-100`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-white rounded-xl ${section.color}`}>
                          <section.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                          <p className="text-gray-600">Manage your {section.title.toLowerCase()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Settings Items */}
                    <div className="p-6">
                      <div className="space-y-6">
                        {section.items.map((item, index) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between py-4 ${
                              index !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Current:</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.current.includes('Disabled') || item.current.includes('Not configured')
                                    ? 'bg-red-100 text-red-700'
                                    : item.current.includes('Enabled') || item.current.includes('Strong')
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.current}
                                </span>
                              </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 ml-4">
                              {item.action}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Settings for Notifications */}
                  {section.id === 'notifications' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold mb-4">Quick Notification Settings</h3>
                      
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between py-2">
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {key === 'sms' ? 'SMS' : key} Notifications
                              </h4>
                              <p className="text-sm text-gray-600">
                                {key === 'email' && 'Receive notifications via email'}
                                {key === 'push' && 'Receive push notifications in browser'}
                                {key === 'sms' && 'Receive SMS for urgent updates'}
                                {key === 'marketing' && 'Receive promotional emails'}
                              </p>
                            </div>
                            <button
                              onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                value ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                  value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Theme Settings for Appearance */}
                  {section.id === 'appearance' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="border-2 border-blue-500 rounded-xl p-4 cursor-pointer">
                          <div className="w-full h-20 bg-white border border-gray-200 rounded-lg mb-3"></div>
                          <div className="text-center">
                            <Sun className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-sm font-medium">Light</span>
                          </div>
                        </div>
                        
                        <div className="border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300">
                          <div className="w-full h-20 bg-gray-800 rounded-lg mb-3"></div>
                          <div className="text-center">
                            <Moon className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-sm font-medium">Dark</span>
                          </div>
                        </div>
                        
                        <div className="border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300">
                          <div className="w-full h-20 bg-gradient-to-b from-white to-gray-800 rounded-lg mb-3"></div>
                          <div className="text-center">
                            <SettingsIcon className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-sm font-medium">System</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
          <div className="bg-red-50 p-6 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl text-red-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
                <p className="text-red-700">Irreversible and destructive actions</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-red-100">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Export Account Data</h3>
                  <p className="text-sm text-gray-600">
                    Download all your data including exchanges, messages, and profile information
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-red-100">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Log Out All Devices</h3>
                  <p className="text-sm text-gray-600">
                    Sign out of your account on all devices and browsers
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-300">
                  <LogOut className="w-4 h-4" />
                  Log Out All
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Delete Account</h3>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}