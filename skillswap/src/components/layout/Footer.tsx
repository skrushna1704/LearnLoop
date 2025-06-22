// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Heart,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Browse Skills', href: '/skills/browse' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Success Stories', href: '/success-stories' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Safety Tips', href: '/safety' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Email', href: 'mailto:hello@LearnLoop.com', icon: Mail },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <svg width="32" height="32" viewBox="0 0 100 100" className="text-indigo-600">
                    <circle cx="50" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <circle cx="50" cy="70" r="10" fill="none" stroke="#764ba2" strokeWidth="3"/>
                    <path d="M 50 52 Q 50 48 50 42" stroke="#f093fb" strokeWidth="3" fill="none"/>
                  </svg>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-20 -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    LearnLoop
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    Learn & Teach
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-6 max-w-sm">
                The world&apos;s first AI-powered skill exchange platform where people trade knowledge instead of money, building communities and creating opportunities.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay in the loop
              </h3>
              <p className="text-gray-600">
                Get the latest updates on new features and skill categories.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 min-w-0 md:min-w-[400px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center text-gray-600 mb-4 md:mb-0">
              <span>© {currentYear} LearnLoop. Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>for learners everywhere.</span>
            </div>
            
            {/* Back to top button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="flex items-center space-x-1 self-start md:self-auto"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Back to top</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;