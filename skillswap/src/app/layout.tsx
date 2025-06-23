// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { CallNotificationProvider } from '@/context/CallNotificationContext';
import { Toaster } from 'react-hot-toast';
import HeaderConditional from '@/components/layout/HeaderConditional';
import Chatbot from '@/components/common/Chatbot';

// Configure Inter font with all weights we need
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'LearnLoop - Learn by Teaching',
  description: 'Connect with passionate learners in your community. Exchange knowledge, share skills, and grow together in the world\'s first peer-to-peer learning platform.',
  keywords: 'learning, teaching, skills, education, community, peer-to-peer, knowledge sharing',
  authors: [{ name: 'LearnLoop Team' }],
  creator: 'LearnLoop',
  publisher: 'LearnLoop',
  robots: 'index, follow',
  openGraph: {
    title: 'LearnLoop - Learn by Teaching',
    description: 'Connect with passionate learners in your community. Exchange knowledge, share skills, and grow together.',
    url: 'https://learnloop.com',
    siteName: 'LearnLoop',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LearnLoop - Learn by Teaching',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnLoop - Learn by Teaching',
    description: 'Connect with passionate learners in your community. Exchange knowledge, share skills, and grow together.',
    images: ['/twitter-image.png'],
    creator: '@learnloop',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          <SocketProvider>
            <CallNotificationProvider>
              <HeaderConditional />
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#10b981',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#10b981',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#ef4444',
                    },
                  },
                }}
              />
            </CallNotificationProvider>
          </SocketProvider>
        </AuthProvider>
        <Chatbot />
      </body>
    </html>
  );
}