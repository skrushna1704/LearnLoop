"use client";

import React from "react";
import {
  Code,
  Palette,
  Music,
  Coffee,
  BookOpen,
  Users,
  Globe,
  ArrowLeftRight,
  Briefcase,
  Languages,
  Handshake,
  GraduationCap,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

const skillCategories = [
  {
    id: "programming",
    name: "Programming & Tech",
    icon: Code,
    color: "bg-blue-100 text-blue-600",
    teaching: 1247,
    learning: 892,
    description: "Exchange web development, mobile apps, data science skills",
  },
  {
    id: "design",
    name: "Design & Creative",
    icon: Palette,
    color: "bg-purple-100 text-purple-600",
    teaching: 892,
    learning: 1156,
    description: "Trade UI/UX, graphic design, illustration expertise",
  },
  {
    id: "languages",
    name: "Languages",
    icon: Languages,
    color: "bg-green-100 text-green-600",
    teaching: 1156,
    learning: 1834,
    description: "Exchange language skills with native speakers",
  },
  {
    id: "business",
    name: "Business & Marketing",
    icon: Briefcase,
    color: "bg-orange-100 text-orange-600",
    teaching: 743,
    learning: 567,
    description: "Trade entrepreneurship, marketing, sales knowledge",
  },
  {
    id: "arts",
    name: "Arts & Music",
    icon: Music,
    color: "bg-pink-100 text-pink-600",
    teaching: 634,
    learning: 892,
    description: "Exchange musical instruments, art techniques, creativity",
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Hobbies",
    icon: Coffee,
    color: "bg-yellow-100 text-yellow-600",
    teaching: 987,
    learning: 1234,
    description: "Trade cooking, fitness, photography, life skills",
  },
];

const platformStats = [
  { value: "125,000+", label: "Skill Exchanges", icon: ArrowLeftRight },
  { value: "50,000+", label: "Active Members", icon: Users },
  { value: "2,500+", label: "Skills Available", icon: BookOpen },
  { value: "120+", label: "Countries", icon: Globe },
];

export default function PublicSkillExchangePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section - Exchange Focus */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Exchange
              </span>{" "}
              Skills, Not Money
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Teach what you know, learn what you need. Join a global community
              where knowledge flows freely and everyone benefits from skill
              exchange.
            </p>

            {/* Value Proposition */}
            <div className="flex items-center justify-center gap-8 mb-8 text-blue-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-medium">Teach Your Skills</span>
              </div>
              <ArrowLeftRight className="w-6 h-6 text-yellow-400" />
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                <span className="font-medium">Learn New Ones</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg">
                <ArrowLeftRight className="w-5 h-5" />
                Start Exchanging Free
              </button>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {platformStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
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
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Exchange Skills Across Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every category has people ready to teach and learn. Find your
              perfect skill swap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => (
              <div key={category.id} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl ${category.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {category.name}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Exchange Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {category.teaching.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">
                        Ready to Teach
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {category.learning.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-600">Want to Learn</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-purple-600 font-semibold">
                      {Math.round(
                        (category.teaching / category.learning) * 100
                      )}
                      % match rate
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Exchange Focus */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to Exchange Skills?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands who are already teaching what they know and
              learning what they need. Your next skill exchange is just one
              click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
                <ArrowLeftRight className="w-5 h-5" />
                Start Your First Exchange
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                <Users className="w-5 h-5" />
                Browse Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
