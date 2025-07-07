'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_WITHOUT_API;

  // Debug user status
  console.log('SocketContext: User status:', { 
    user: !!user, 
    userId: user?.id,
    userEmail: user?.email 
  });

  useEffect(() => {
    console.log('SocketContext: useEffect triggered with user:', user);
    
    if (user) {
      console.log('SocketContext: User found, creating socket...');
      
      // Create socket instance only if it doesn't exist
      if (!socketRef.current) {
        console.log('SocketContext: Creating new socket instance for user:', user.id);
        
        // The API URL is for REST calls. Sockets connect to the base URL.
        const socketUrl = apiUrl;

        const socket = io(socketUrl, {
          path: '/socket.io', // Explicitly define the path
          query: { userId: user.id },
          transports: ['websocket', 'polling'],
          reconnection: true,
          autoConnect: false,
        });
        socketRef.current = socket;
        console.log('SocketContext: Socket instance created:', socket.id);
      } else {
        console.log('SocketContext: Socket instance already exists:', socketRef.current.id);
      }

      const socket = socketRef.current;

      // Define listeners
      const onConnect = () => {
        console.log('SocketContext: Socket connected:', socket.id, 'for user:', user.id);
        setIsConnected(true);
      };
      
      const onDisconnect = (reason: Socket.DisconnectReason) => {
        console.log('SocketContext: Socket disconnected:', reason);
        setIsConnected(false);
      };

      const onConnectError = (error: Error) => {
        console.error('SocketContext: Socket connection error:', error);
        setIsConnected(false);
      };

      // Attach listeners
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('connect_error', onConnectError);

      // Manually connect if not already connected
      if (!socket.connected) {
        console.log('SocketContext: Attempting to connect...');
        socket.connect();
      } else {
        console.log('SocketContext: Socket already connected');
        setIsConnected(true);
      }

      // Cleanup on component unmount or user change
      return () => {
        console.log('SocketContext: useEffect cleanup running.');
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('connect_error', onConnectError);
      };
    } else {
      console.log('SocketContext: No user found, skipping socket creation');
      // User logged out, tear down the connection
      if (socketRef.current) {
        console.log('SocketContext: User logged out, disconnecting.');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }
  }, [user, apiUrl]);

  // Always provide the socket, even if it's null or not connected
  const contextValue = {
    socket: socketRef.current,
    isConnected
  };

  console.log('SocketContext: Providing context:', { 
    socket: !!socketRef.current, 
    isConnected,
    socketId: socketRef.current?.id 
  });

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};