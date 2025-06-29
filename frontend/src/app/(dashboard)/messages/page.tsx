'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useSearchParams } from 'next/navigation';
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
  Trash2,
  Image as ImageIcon,
  FileText,
  File,
  Plus,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFileToSupabase } from '@/lib/uploadFile';

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

interface FileData {
  type: string;
  url: string;
  name: string;
  mime: string;
}

const quickReplies = [
  'Sounds great! 👍',
  'Let me check my calendar',
  'Can we reschedule?',
  'Thanks for the session!',
  'I\'m available',
  'Looking forward to it!'
];

const menuItems = [
  {
    id: 'image',
    icon: ImageIcon,
    label: 'Image',
    description: 'JPG, PNG, GIF, WebP',
    color: 'from-purple-500 to-pink-500',
    hoverColor: 'hover:from-purple-600 hover:to-pink-600'
  },
  {
    id: 'pdf',
    icon: FileText,
    label: 'PDF',
    description: 'PDF documents',
    color: 'from-red-500 to-orange-500',
    hoverColor: 'hover:from-red-600 hover:to-orange-600'
  },
  {
    id: 'doc',
    icon: File,
    label: 'Document',
    description: 'DOC, DOCX, TXT',
    color: 'from-blue-500 to-cyan-500',
    hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
  },
  {
    id: 'all',
    icon: Plus,
    label: 'Any File',
    description: 'All file types',
    color: 'from-green-500 to-emerald-500',
    hoverColor: 'hover:from-green-600 hover:to-emerald-600'
  }
];

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const searchParams = useSearchParams();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ [userId: string]: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [fileType, setFileType] = useState<'all' | 'image' | 'pdf' | 'doc'>('all');

  // Debug authentication and socket status
  console.log('MessagesPage: Auth & Socket status:', { 
    currentUser: !!currentUser,
    currentUserId: currentUser?.id,
    currentUserEmail: currentUser?.email,
    socket: !!socket, 
    isConnected, 
    socketId: socket?.id,
    socketConnected: socket?.connected 
  });

  // Update ref whenever selectedConversation changes
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Effect to set up socket event listeners when socket is available
  useEffect(() => {
    if (!socket) {
      console.log('❌ Socket not available yet');
      return;
    }

    console.log('✅ Setting up socket event listeners for messages...');
    console.log('Socket connected:', socket.connected);
    console.log('Socket ID:', socket.id);

    // Test socket connection
    socket.emit('test', { message: 'Hello from messages page' });
    console.log('📤 Test message sent to server');

    // Set up global event listeners that don't depend on selectedConversation
    const handleNewMessage = (newMessage: Message) => {
      // If the message is for the currently selected conversation
      if (selectedConversationRef.current && newMessage.exchangeId === selectedConversationRef.current._id) {
        setMessages(prevMessages => {
          if (prevMessages.some(msg => msg._id === newMessage._id)) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
        setConversations(prevConvs => prevConvs.map(conv =>
          conv._id === newMessage.exchangeId
            ? { ...conv, lastMessage: newMessage.content, lastMessageTime: newMessage.createdAt }
            : conv
        ));
      } else {
        // Message is for another conversation
        setConversations(prevConvs => prevConvs.map(conv =>
          conv._id === newMessage.exchangeId
            ? { ...conv, lastMessage: newMessage.content, lastMessageTime: newMessage.createdAt, unread: (conv.unread || 0) + 1 }
            : conv
        ));
        // Show toast notification
        toast.custom((t) => (
          <div className={`bg-white shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 border-l-4 border-blue-500 ${t.visible ? 'animate-enter' : 'animate-leave'}`}> 
            <img src={newMessage.senderId.profile.profilePicture || 'https://i.pravatar.cc/150?img=1'} alt={newMessage.senderId.profile.name} className="w-8 h-8 rounded-full" />
            <div>
              <div className="font-semibold text-gray-800">{newMessage.senderId.profile.name}</div>
              <div className="text-gray-600 text-sm">{newMessage.content}</div>
            </div>
          </div>
        ), { duration: 4000 });
        // Play notification sound
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }
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

    // Add test response handler
    socket.on('testResponse', (data) => {
      console.log('✅ Test response received:', data);
    });

    // Add connection status listeners
    socket.on('connect', () => {
      console.log('🔗 Socket connected in messages page');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected in messages page');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error in messages page:', error);
    });

    return () => {
      console.log('🧹 Cleaning up socket event listeners');
      socket.off('newMessage', handleNewMessage);
      socket.off('chatCleared', handleChatCleared);
      socket.off('testResponse');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [socket]); // Only depend on socket, not empty array

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

        // Join rooms for all conversations when socket is connected
        if (socket && isConnected) {
          console.log('Joining rooms for all conversations...');
          data.forEach((conv: Conversation) => {
            console.log('Joining room:', conv._id);
            socket.emit('joinRoom', conv._id);
          });
        } else {
          console.log('Socket not ready for room joining:', { socket: !!socket, isConnected });
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [currentUser, searchParams, socket, isConnected]);

  // Effect for joining and leaving socket rooms when conversation changes
  useEffect(() => {
    if (selectedConversation && socket && isConnected) {
      console.log('🏠 Joining room for selected conversation:', selectedConversation._id);
      console.log('Socket connected:', socket.connected);
      console.log('Socket ID:', socket.id);
      
      // Add a small delay to ensure socket is ready
      setTimeout(() => {
        if (socket.connected) {
          socket.emit('joinRoom', selectedConversation._id);
          console.log('📤 Room join request sent for:', selectedConversation._id);
          
          // We'll check if we're in the room by listening for a test message
          setTimeout(() => {
            console.log('🔍 Checking if we received any messages in the last 2 seconds...');
          }, 2000);
          
        } else {
          console.log('❌ Socket disconnected, cannot join room');
        }
      }, 100);
    } else {
      console.log('❌ Cannot join room - socket not connected or conversation not ready');
      console.log('Selected conversation:', selectedConversation?._id);
      console.log('Socket available:', !!socket);
      console.log('Socket connected:', socket?.connected);
      console.log('Is connected state:', isConnected);
    }
  }, [selectedConversation?._id, socket, isConnected]);

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

  // When a conversation is selected, clear its unread count
  useEffect(() => {
    if (selectedConversation) {
      setConversations(prevConvs => prevConvs.map(conv =>
        conv._id === selectedConversation._id ? { ...conv, unread: 0 } : conv
      ));
    }
  }, [selectedConversation]);

  // Listen for online/offline events
  useEffect(() => {
    if (!socket) return;
    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => ({ ...prev, [userId]: true }));
    };
    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    };
    const handleOnlineUsers = ({ userIds }: { userIds: string[] }) => {
      const onlineMap: { [userId: string]: boolean } = {};
      userIds.forEach(id => { onlineMap[id] = true; });
      setOnlineUsers(onlineMap);
    };
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('onlineUsers', handleOnlineUsers);
    return () => {
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation && currentUser) {
      const token = localStorage.getItem('authToken');
      const partner = selectedConversation.proposer._id === currentUser.id
        ? selectedConversation.receiver
        : selectedConversation.proposer;

      // Store the message content and clear the input immediately for better UX
      const contentToSend = message;
      setMessage('');

      try {
        console.log('Sending message via API...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            exchangeId: selectedConversation._id,
            receiverId: partner._id,
            content: contentToSend,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // No UI update needed here. The 'newMessage' socket event will handle it
        // for both the sender and the receiver, ensuring a single source of truth.
        console.log('Message sent successfully. Waiting for broadcast to update UI.');
        
      } catch (err) {
        console.error('Failed to send message:', err);
        // If sending fails, restore the message to the input box
        setMessage(contentToSend);
        // Optionally, show an error toast to the user
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation || !currentUser) return;
    try {
      const url = await uploadFileToSupabase(file);
      // Send as a file message
      const token = localStorage.getItem('authToken');
      const partner = selectedConversation.proposer._id === currentUser.id
        ? selectedConversation.receiver
        : selectedConversation.proposer;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          exchangeId: selectedConversation._id,
          receiverId: partner._id,
          content: JSON.stringify({
            type: 'file',
            url,
            name: file.name,
            mime: file.type,
          }),
        }),
      });
      // The socket event will update the UI
    } catch (err) {
      alert('File upload failed: ' + (err as Error).message);
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
      {/* Notification sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      {/* Debug Panel - Remove in production */}
      {/* <div className="bg-yellow-100 p-2 text-xs border-b">
        <div className="flex gap-4">
          <span>Socket: {socket ? '✅' : '❌'}</span>
          <span>Connected: {isConnected ? '✅' : '❌'}</span>
          <span>Socket ID: {socket?.id || 'N/A'}</span>
          <span>Selected Conv: {selectedConversation?._id || 'N/A'}</span>
        </div>
      </div> */}
      
      <div className="h-full flex">
        
        {/* Conversations Sidebar */}
        <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${showChat ? 'hidden' : 'block'} md:block`}>
          
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
                  onClick={() => { setSelectedConversation(conversation); setShowChat(true); }}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                    selectedConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 relative">
                    
                    {/* Avatar with Online Status */}
                    <div className="relative">
                      <img
                        src={partner.profile.profilePicture || 'https://i.pravatar.cc/150?img=1'}
                        alt={partner.profile.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      {/* Online/offline dot */}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          onlineUsers[partner._id] ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      {/* Unread badge */}
                      {(conversation.unread ?? 0) > 0 ? (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">{conversation.unread ?? 0}</span>
                      ) : null}
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
        <div className={`flex-1 flex flex-col bg-white ${showChat ? 'block' : 'hidden'} md:block`}>
          
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Back button for mobile */}
                <button className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100" onClick={() => setShowChat(false)} aria-label="Back to conversations">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
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
                {/* <button 
                  onClick={testRealTimeMessage}
                  className="p-3 hover:bg-white/70 rounded-xl transition-colors duration-200 group text-xs"
                  title="Test Real-time Message"
                >
                  🧪 Test
                </button> */}
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
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
            {messages.map((msg) => {
              let isFile = false;
              let fileData: FileData | null = null;
              try {
                fileData = JSON.parse(msg.content);
                isFile = !!(fileData && fileData.type === 'file');
              } catch {}
              return (
                <div key={msg._id} className={`flex ${msg.senderId._id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90vw] sm:max-w-[70%] ${
                    msg.senderId._id === currentUser?.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-sm'
                  } p-3 sm:p-4 relative`}>
                    {isFile && fileData ? (
                      fileData.mime && fileData.mime.startsWith('image/') ? (
                        <img src={fileData.url} alt={fileData.name} style={{ maxWidth: 200, borderRadius: 8 }} />
                      ) : (
                        <a href={fileData.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-200">{fileData.name}</a>
                      )
                    ) : (
                      <p className="leading-relaxed text-sm sm:text-base">{msg.content}</p>
                    )}
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
              );
            })}
            
            {/* Quick Replies */}
            <div className="flex flex-wrap gap-2 pt-4">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(reply)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 sm:p-6 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="flex items-end gap-2 sm:gap-3">
              
              {/* Attachment Button */}
              <div className="relative">
                <button
                  className={`relative p-2 sm:p-3 rounded-xl transition-all duration-300 group ${
                    showAttachMenu
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25'
                      : 'bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
                  }`}
                  onClick={() => setShowAttachMenu((prev) => !prev)}
                  type="button"
                >
                  <div className="relative">
                    {showAttachMenu ? (
                      <X className={`w-5 h-5 transition-all duration-300 ${showAttachMenu ? 'text-white' : 'text-gray-600 group-hover:text-white'}`} />
                    ) : (
                      <Paperclip className={`w-5 h-5 transition-all duration-300 ${showAttachMenu ? 'text-white' : 'text-gray-600 group-hover:text-white'}`} />
                    )}
                  </div>
                  {!showAttachMenu && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  )}
                </button>
                {showAttachMenu && (
                  <div className="absolute left-0 bottom-full mb-3 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-20 p-3 w-64 flex flex-col">
                    <div className="grid grid-cols-2 gap-3">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            className={`flex flex-col items-center justify-center rounded-xl bg-gradient-to-r ${item.color} ${item.hoverColor} text-white p-3 transition-all duration-200 hover:shadow-md`}
                            onClick={() => { setFileType(item.id as 'all' | 'image' | 'pdf' | 'doc'); fileInputRef.current?.click(); setShowAttachMenu(false); }}
                          >
                            <Icon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  accept={
                    fileType === 'image' ? 'image/*'
                    : fileType === 'pdf' ? '.pdf'
                    : fileType === 'doc' ? '.doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    : '*'
                  }
                  onChange={handleFileChange}
                />
              </div>
              
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
                  className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 text-sm sm:text-base"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                
                {/* Emoji Button */}
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Voice Message */}
              <button className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 group">
                <Mic className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
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