// src/components/layout/Header.tsx
"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/helpers";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import router from "next/router";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuth();

  const mainNavItems = [
    // { name: 'Home', href: '/' },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Exchange Skills", href: "/skills" },
  ];

  const exploreNavItems = [
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "Find Teachers", href: "/teachers" },
    { name: "Resources", href: "/resources" },
  ];

  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const navItems = isAuthenticated
    ? [...mainNavItems, { name: "Dashboard", href: "/dashboard" }]
    : mainNavItems;

  const userMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Messages", href: "/messages", icon: MessageCircle },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    // { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Hamburger menu for mobile - now on the left */}
          <div className="md:hidden flex items-center mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              {/* LearnLoop Logo SVG */}
              <div className="relative">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 100 100"
                  className="text-indigo-600"
                >
                  <circle
                    cx="50"
                    cy="30"
                    r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="70"
                    r="10"
                    fill="none"
                    stroke="#764ba2"
                    strokeWidth="3"
                  />
                  <path
                    d="M 50 52 Q 50 48 50 42"
                    stroke="#f093fb"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-20 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LearnLoop
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                  Learn by Teaching
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-indigo-600 relative",
                  isActiveLink(item.href) ? "text-indigo-600" : "text-gray-700"
                )}
              >
                {item.name}
                {/* Active indicator */}
                {isActiveLink(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Explore Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExploreOpen((open) => !open)}
                onBlur={() => setTimeout(() => setIsExploreOpen(false), 150)}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-indigo-600 flex items-center gap-1",
                  isExploreOpen ? "text-indigo-600" : "text-gray-700"
                )}
                type="button"
              >
                Explore
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isExploreOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20">
                  {exploreNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600",
                        isActiveLink(item.href) &&
                          "text-indigo-600 bg-indigo-50"
                      )}
                      onClick={() => setIsExploreOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search - only show when authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Notifications - only show when authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs text-white flex items-center justify-center shadow-lg">
                  3
                </span>
              </Button>
            )}

            {/* User menu or Auth buttons */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 hover:bg-indigo-50"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {user.profile?.profilePicture ? (
                    <Image
                      src={user.profile.profilePicture || ''}
                      alt={user.profile.name || 'User'}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-medium">
                        {user.profile?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.profile?.name?.split(" ")[0]}
                  </span>
                </Button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.profile?.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                    <div className="border-t border-gray-100 mt-2">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={async () => {
                          await logout();
                          router.push("/");
                        }}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-lg transition-colors",
                    isActiveLink(item.href)
                      ? "text-indigo-600 bg-indigo-50 border border-indigo-200"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                  {isActiveLink(item.href) && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full inline-block ml-2"></div>
                  )}
                </Link>
              ))}

              <div className="mt-2">
                <div className="font-semibold text-gray-500 px-3 py-1">
                  Explore
                </div>
                {exploreNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-lg transition-colors",
                      isActiveLink(item.href)
                        ? "text-indigo-600 bg-indigo-50 border border-indigo-200"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                    {isActiveLink(item.href) && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full inline-block ml-2"></div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile auth buttons */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      size="sm"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      size="sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile user menu */}
              {isAuthenticated && user && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2 mb-3">
                    {user.profile?.profilePicture ? (
                      <Image
                        src={user.profile.profilePicture || ''}
                        alt={user.profile.name || 'User'}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full ring-2 ring-indigo-100"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.profile?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.profile?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg mx-2 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}

                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg mx-2 mt-2 transition-colors">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
