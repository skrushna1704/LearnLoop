'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Calendar,
  Mic,
  Check,
  CheckCheck,
  Trash2
} from 'lucide-react';

// Define interfaces for our data structures
interface Message {
  _id: string;
  exchangeId: string;
  senderId: {
    _id: string;
    profile: {
      name: string;
      profilePicture: string;
    }
  };
  content: string;
  createdAt: string;
  status?: 'read' | 'delivered';
}

interface Conversation {
  _id: string;
  proposer: { _id: string; profile: { name: string; profilePicture: string } };
  receiver: { _id: string; profile: { name: string; profilePicture: string } };
  title: string;
  status: 'pending' | 'active' | 'completed';
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
}

const quickReplies = [
  'Sounds great! 👍',
  'Let me check my calendar',
  'Can we reschedule?',
  'Thanks for the session!',
  'I\'m available',
  'Looking forward to it!'
];

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();

  const socketRef = useRef<Socket | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);

  // Update ref whenever selectedConversation changes
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Effect to establish a single socket connection on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Setting up socket connection...');
    
    // Establish connection, providing token for potential authentication
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050', {
      auth: {
        token: token
      }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Set up global event listeners that don't depend on selectedConversation
    const handleNewMessage = (newMessage: Message) => {
      console.log('Received new message:', newMessage);
      setMessages(prevMessages => {
        // Only add if it's for the currently selected conversation
        const currentConv = selectedConversationRef.current;
        if (currentConv && newMessage.exchangeId === currentConv._id) {
          console.log('Adding message to current conversation');
          return [...prevMessages, newMessage];
        }
        console.log('Message not for current conversation');
        return prevMessages;
      });
      
      // Update conversation list with new message
      setConversations(prevConvs => prevConvs.map(conv => 
        conv._id === newMessage.exchangeId 
        ? { ...conv, lastMessage: newMessage.content, lastMessageTime: newMessage.createdAt }
        : conv
      ));
    };

    const handleChatCleared = (data: { exchangeId: string }) => {
      console.log('Received chat cleared event:', data);
      const currentConv = selectedConversationRef.current;
      if (currentConv && data.exchangeId === currentConv._id) {
        console.log('Clearing messages for current conversation');
        setMessages([]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('chatCleared', handleChatCleared);

    return () => {
      console.log('Cleaning up socket connection');
      socket.off('newMessage', handleNewMessage);
      socket.off('chatCleared', handleChatCleared);
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  // Effect for fetching initial conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        setConversations(data);
        
        const exchangeIdFromQuery = searchParams.get('exchangeId');
        if (exchangeIdFromQuery) {
          const conversationToSelect = data.find((conv: Conversation) => conv._id === exchangeIdFromQuery);
          if (conversationToSelect) {
            setSelectedConversation(conversationToSelect);
          }
        } else if (data.length > 0) {
          setSelectedConversation(data[0]);
        }

        if (socketRef.current) {
          data.forEach((conv: Conversation) => {
            console.log('Joining room:', conv._id);
            socketRef.current?.emit('joinRoom', conv._id);
          });
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [currentUser, searchParams]);

  // Effect for joining and leaving socket rooms when conversation changes
  useEffect(() => {
    if (selectedConversation && socketRef.current) {
      console.log('Joining room:', selectedConversation._id);
      socketRef.current.emit('joinRoom', selectedConversation._id);
    } else {
      console.log('Cannot join room - socket or conversation not ready');
    }
  }, [selectedConversation?._id]);

  // Effect for fetching messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${selectedConversation._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setMessages([]); // Clear messages on error
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation && currentUser) {
      const token = localStorage.getItem('authToken');
      const partner = selectedConversation.proposer._id === currentUser.id
        ? selectedConversation.receiver
        : selectedConversation.proposer;

      // Optimistic UI update
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        exchangeId: selectedConversation._id,
        senderId: {
          _id: currentUser.id,
          profile: {
            name: currentUser.profile?.name || 'You',
            profilePicture: currentUser.profile?.profilePicture || '',
          }
        },
        content: message,
        createdAt: new Date().toISOString(),
        status: 'delivered'
      };

      setMessages(prev => [...prev, tempMessage]);
      setMessage('');

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            exchangeId: selectedConversation._id,
            receiverId: partner._id,
            content: message,
          }),
        });
      } catch (err) {
        console.error('Failed to send message:', err);
        // Optionally show an error to the user and remove the optimistic message
        setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      }
    }
  };

  const handleClearChat = async () => {
    if (!selectedConversation) return;

    if (window.confirm('Are you sure you want to delete all messages in this chat? This cannot be undone.')) {
      setMessages([]); // Optimistically clear the chat
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${selectedConversation._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        // The chat is already cleared visually. The socket event will handle other clients.
      } catch (err) {
        console.error('Failed to clear chat:', err);
        // If the API call fails, we should ideally refetch the messages to restore the UI.
        // For now, we'll log the error.
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper loader
  }
  
  if (error) {
    return <div>Error: {error}</div>; // Replace with a proper error component
  }

  if (!selectedConversation) {
    return <div>No conversations found.</div>; // Handle empty state
  }

  return (
    <div className="h-[calc(100vh-2rem)] bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl overflow-hidden shadow-lg">
      <div className="h-full flex">
        
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => {
              const partner = conversation.proposer._id === currentUser?.id ? conversation.receiver : conversation.proposer;
              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                    selectedConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Avatar with Online Status */}
                    <div className="relative">
                      <img
                        src={partner.profile.profilePicture || 'https://i.pravatar.cc/150?img=1'}
                        alt={partner.profile.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      {/* {conversation.user.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )} */}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{partner.profile.name}</h3>
                        <p className="text-xs text-gray-500">{conversation.lastMessageTime}</p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedConversation.proposer._id === currentUser?.id ? selectedConversation.receiver.profile.profilePicture : selectedConversation.proposer.profile.profilePicture || 'https://i.pravatar.cc/150?img=1'}
                    alt={selectedConversation.proposer._id === currentUser?.id ? selectedConversation.receiver.profile.name : selectedConversation.proposer.profile.name}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  {/* {selectedConversation.user.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )} */}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.proposer._id === currentUser?.id ? selectedConversation.receiver.profile.name : selectedConversation.proposer.profile.name}</h2>
                    {/* {selectedConversation.user.verified && (
                      <Star className="w-4 h-4 text-blue-500 fill-current" />
                    )} */}
                  </div>
                  {/* <p className="text-sm text-gray-600">{selectedConversation.user.role}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {selectedConversation.user.location}
                    {selectedConversation.user.online ? (
                      <span className="text-green-600 font-medium">• Online</span>
                    ) : (
                      <span>• Last seen 2h ago</span>
                    )}
                  </div> */}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-white/70 rounded-xl transition-colors duration-200 group">
                  <Phone className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                <button className="p-3 hover:bg-white/70 rounded-xl transition-colors duration-200 group">
                  <Video className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="p-3 hover:bg-white/70 rounded-xl transition-colors duration-200 group"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10">
                      <button
                        onClick={() => {
                          handleClearChat();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Exchange Info Banner */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700">You&apos;re Teaching</div>
                    <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                      {/* {selectedConversation.exchange.yourSkill} */}
                    </div>
                  </div>
                  <div className="text-gray-400">↔</div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700">You&apos;re Learning</div>
                    <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                      {/* {selectedConversation.exchange.theirSkill} */}
                    </div>
                  </div>
                </div>
                
                {selectedConversation.status === 'active' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Join Session</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.senderId._id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${
                  msg.senderId._id === currentUser?.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-sm'
                } p-4 relative`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    msg.senderId._id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    {msg.senderId._id === currentUser?.id && (
                      <div className="flex items-center gap-1">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Replies */}
            <div className="flex flex-wrap gap-2 pt-4">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(reply)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-3">
              
              {/* Attachment Button */}
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 group">
                <Paperclip className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
              
              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                
                {/* Emoji Button */}
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Voice Message */}
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 group">
                <Mic className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  message.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}