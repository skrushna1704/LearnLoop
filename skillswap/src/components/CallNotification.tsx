'use client';

import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, X, Video } from 'lucide-react';

interface CallNotificationProps {
  exchangeId: string;
  message: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CallNotification({
  exchangeId,
  message,
  onAccept,
  onDecline
}: CallNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(30); // Auto-decline after 30 seconds

  useEffect(() => {
    // Auto-decline timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  // Ring animation
  const [isRinging, setIsRinging] = useState(true);
  useEffect(() => {
    const ringTimer = setInterval(() => {
      setIsRinging(prev => !prev);
    }, 1000);

    return () => clearInterval(ringTimer);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden" />
      
      {/* Notification */}
      <div className="fixed top-4 right-4 sm:w-96 w-[calc(100%-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 ${isRinging ? 'scale-110' : 'scale-100'}`}>
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Incoming Video Call</h3>
                <p className="text-blue-100 text-sm">Exchange #{exchangeId.slice(-6)}</p>
              </div>
            </div>
            
            <button
              onClick={onDecline}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
            {message}
          </p>
          
          {/* Timer */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Auto-decline in {timeLeft}s
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <PhoneOff className="w-5 h-5" />
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Accept
            </button>
          </div>
        </div>

        {/* Progress bar for timer */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-linear"
            style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}