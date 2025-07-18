'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import CallNotification from '@/components/CallNotification';
import { useRouter, usePathname } from 'next/navigation';

interface CallNotificationContextType {
  showNotification: (exchangeId: string, message: string) => void;
  hideNotification: () => void;
}

interface IncomingCall {
  exchangeId: string;
  message: string;
  callerId: string;
  callerUserId: string;
  roomId: string;
}

const CallNotificationContext = createContext<CallNotificationContextType | undefined>(undefined);

export function CallNotificationProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const router = useRouter();
  const pathname = usePathname();
  const [notification, setNotification] = useState<IncomingCall | null>(null);

  useEffect(() => {
    if (socket) {
      console.log('Setting up call notification listeners');

      // Listen for incoming calls
      const handleCallIncoming = (callData: IncomingCall) => {
        console.log('Incoming call notification received:', callData);
        
        // Don't show notification if we're on the messages page (handled by messages page itself)
        if (pathname === '/messages') {
          console.log('Ignoring call notification on messages page');
          return;
        }
        
        setNotification(callData);
      };

      // Listen for call rejection
      const handleCallRejected = ({ exchangeId }: { exchangeId: string }) => {
        console.log('Call was rejected:', exchangeId);
        if (notification?.exchangeId === exchangeId) {
          setNotification(null);
        }
      };

      // Listen for call acceptance
      const handleCallAccepted = ({ exchangeId }: { exchangeId: string }) => {
        console.log('Call was accepted:', exchangeId);
        if (notification?.exchangeId === exchangeId) {
          setNotification(null);
        }
      };

      socket.on('call-incoming', handleCallIncoming);
      socket.on('call-rejected', handleCallRejected);
      socket.on('call-accepted', handleCallAccepted);

      return () => {
        console.log('Cleaning up call notification listeners');
        socket.off('call-incoming', handleCallIncoming);
        socket.off('call-rejected', handleCallRejected);
        socket.off('call-accepted', handleCallAccepted);
      };
    }
  }, [socket, notification]);

  const showNotification = (exchangeId: string, message: string) => {
    setNotification({
      exchangeId,
      message,
      callerId: '',
      callerUserId: '',
      roomId: `call-${exchangeId}`
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const handleAcceptCall = () => {
    if (notification && socket) {
      console.log('Accepting call for exchange:', notification.exchangeId);
      
      // Emit acceptance to the call room
      socket.emit('accept-call', {
        roomId: notification.roomId,
        exchangeId: notification.exchangeId
      });
      
      // Only navigate to exchanges page if not on messages page
      if (pathname !== '/messages') {
        router.push(`/exchanges/${notification.exchangeId}/call`);
      }
      
      // Hide notification
      setNotification(null);
    }
  };

  const handleDeclineCall = () => {
    if (notification && socket) {
      console.log('Declining call for exchange:', notification.exchangeId);
      
      // Emit rejection to the call room
      socket.emit('reject-call', {
        roomId: notification.roomId,
        exchangeId: notification.exchangeId
      });
      
      // Hide notification
      setNotification(null);
    }
  };

  return (
    <CallNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <CallNotification
          exchangeId={notification.exchangeId}
          message={notification.message}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </CallNotificationContext.Provider>
  );
}

export function useCallNotification() {
  const context = useContext(CallNotificationContext);
  if (context === undefined) {
    throw new Error('useCallNotification must be used within a CallNotificationProvider');
  }
  return context;
}