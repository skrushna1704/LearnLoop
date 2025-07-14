'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { 
  Search, 
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle,
  Video,
  Star,
  Users,
  BookOpen,
  Award,
  AlertCircle,
  Plus,
  ArrowRight,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { CardSkeleton } from '@/components/common';

interface UserReference {
  _id: string;
  profile: {
    name?: string;
    profilePicture?: string;
    role?: string;
    rating?: number;
    verified?: boolean;
  }
}

interface IExchange {
  _id: string;
  title: string;
  proposer: UserReference;
  receiver: UserReference;
  status: 'pending' | 'active' | 'completed' | 'rejected' | 'scheduled';
  myRole?: 'teacher' | 'learner' | 'both'; 
  skillTaught?: { name: string };
  skillLearned?: { name: string };
  progress: number;
  sessionsCompleted?: number;
  totalSessions?: number;
  nextSession?: { date: string; time: string; };
  proposedDate?: string;
  completedDate?: string;
  location?: string;
  type?: string;
  feedback?: {
    user: string;
    rating: number;
    comment: string;
  }[];
}

const statusConfig: { [key: string]: { color: string; icon: React.ElementType; label: string } } = {
  active: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Timer,
    label: 'Active'
  },
  completed: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    label: 'Completed'
  },
  pending: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: AlertCircle,
    label: 'Pending Approval'
  },
  scheduled: {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Calendar,
    label: 'Scheduled'
  }
};

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<IExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();
  const { socket, isConnected } = useSocket();
  const router = useRouter();

  // Effect to fetch exchange data when the user is available
  useEffect(() => {
    if (currentUser) {
      const fetchExchanges = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('authToken');
          if (!token) throw new Error('Authentication token not found.');
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Failed to fetch exchanges');
          
          const data = await response.json();
          setExchanges(data);
        } catch (err) {
          if (err instanceof Error) setError(err.message);
          else setError('An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchExchanges();
    } else {
      // If there's no user, clear exchanges and stop loading.
      setExchanges([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Effect to join/leave socket rooms based on connection status and exchanges data
  useEffect(() => {
    if (isConnected && socket && exchanges.length > 0) {
      const exchangeIds = exchanges.map(e => e._id);
      
      console.log('STABLE: Joining rooms for exchanges:', exchangeIds);
      socket.emit('joinMultipleRooms', exchangeIds);

      // This cleanup function will ONLY run when the component is truly unmounted,
      // not on every re-render.
      return () => {
        if (socket.connected) { // Check if socket is still connected before emitting
          console.log('STABLE: Leaving rooms for exchanges:', exchangeIds);
          socket.emit('leaveMultipleRooms', exchangeIds);
        }
      };
    }
  }, [isConnected, socket, exchanges]); // Added `exchanges` back to dependency array

  const stats = {
    totalExchanges: exchanges.length,
    activeExchanges: exchanges.filter(e => e.status === 'active').length,
    completedExchanges: exchanges.filter(e => e.status === 'completed').length,
    hoursLearned: 156 // This should be calculated from real data
  };

  const filteredExchanges = exchanges.filter(exchange => {
    if (!exchange) return false;
    const matchesFilter = activeFilter === 'all' || exchange.status === activeFilter;
    const searchLower = searchTerm.toLowerCase();
    const partner = exchange.proposer && exchange.proposer._id === currentUser?.id ? exchange.receiver : exchange.proposer;
    const matchesSearch = exchange.title?.toLowerCase().includes(searchLower) ||
                         (partner && partner.profile && partner.profile.name && partner.profile.name.toLowerCase().includes(searchLower)) ||
                         (exchange.skillTaught && exchange.skillTaught.name && exchange.skillTaught.name.toLowerCase().includes(searchLower)) ||
                         (exchange.skillLearned && exchange.skillLearned.name && exchange.skillLearned.name.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-2xl">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Skill Exchanges</h1>
                <p className="text-blue-100 text-lg">Track your learning journey and teaching impact</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">{stats.totalExchanges}</div>
                    <div className="text-sm text-blue-100">Total Exchanges</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">{stats.activeExchanges}</div>
                    <div className="text-sm text-blue-100">Active Now</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">{stats.completedExchanges}</div>
                    <div className="text-sm text-blue-100">Completed</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">{stats.hoursLearned}</div>
                    <div className="text-sm text-blue-100">Hours Learned</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/exchanges/new')}
                className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Start New Exchange
              </button>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exchanges by title, partner, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="flex gap-3">
              {['all', 'active', 'scheduled', 'pending', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    activeFilter === filter
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exchanges Grid */}
        <div className="grid gap-6">
          {filteredExchanges.map((exchange) => {
            if (!exchange) return null;
            const statusInfo = statusConfig[exchange.status];
            const StatusIcon = statusInfo.icon;
            
            const partner = exchange.proposer && exchange.proposer._id === currentUser?.id ? exchange.receiver : exchange.proposer;
            if (!partner || !exchange._id) return null;
            
            return (
              <div key={exchange._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
                
                {/* Exchange Header */}
                <div className="p-6 pb-4">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Image
                            src={partner.profile.profilePicture || 'https://i.pravatar.cc/150?img=1'}
                            alt={partner.profile.name || 'Partner profile'}
                            className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
                            width={64}
                            height={64}
                          />
                          {partner.profile.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <Star className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{exchange.title}</h3>
                              <p className="text-gray-600">{partner.profile.name} • {partner.profile?.role}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{partner.profile?.rating ? partner.profile.rating.toFixed(1) : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Skills Exchange */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                exchange.myRole === 'teacher' || exchange.myRole === 'both' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {exchange.myRole === 'teacher' ? '👨‍🏫 Teaching' : 
                                 exchange.myRole === 'learner' ? '👨‍🎓 Learning' : '🔄 Exchanging'}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {exchange.myRole === 'learner' ? 'Your Skill' : 'Teaching'}
                                </div>
                                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                  {exchange.skillTaught?.name}
                                </div>
                              </div>
                              
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {exchange.myRole === 'learner' ? 'Learning' : 'Their Skill'}
                                </div>
                                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  {exchange.skillLearned?.name}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Session Info */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {exchange.nextSession?.date || exchange.proposedDate || exchange.completedDate}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {exchange.nextSession?.time || 'Completed'}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {exchange.location}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              {exchange.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end gap-4 lg:w-64">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-medium">{statusInfo.label}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      {exchange.progress !== undefined && (
                        <div className="w-full">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{exchange.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${exchange.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {exchange.sessionsCompleted}/{exchange.totalSessions} sessions
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <Link href={`/messages?exchangeId=${exchange._id}`} passHref>
                          <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
                            <MessageSquare size={16} />
                            Message
                          </Button>
                        </Link>
                        
                        {exchange.status === 'active' && (
                          <Link href={`/exchanges/${exchange._id}/call`} passHref>
                            <Button size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 flex-1">
                              <Video size={16} />
                              Join Call
                            </Button>
                          </Link>
                        )}
                        
                        {exchange.status === 'scheduled' && (
                          <Button size="sm" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 flex-1">
                            <Calendar size={16} />
                            Confirm
                          </Button>
                        )}
                        
                        {exchange.status === 'pending' && (
                          <Link href={`/exchanges/${exchange._id}`} passHref>
                            <Button size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 flex-1" onClick={() => {
                              console.log('Review button clicked');
                            }}>
                              <Clock size={16} />
                              Review
                            </Button>
                          </Link>
                        )}
                        
                        {exchange.status === 'completed' && (
                          <Button size="sm" className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 flex-1">
                            <Award size={16} />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info for Completed Exchanges */}
                {exchange.status === 'completed' && exchange.feedback && (
                  <div className="px-6 pb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Exchange Completed</span>
                        {partner.profile.rating && (
                          <div className="flex items-center gap-1 ml-auto">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < (partner.profile?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-green-700 italic">&quot;{exchange.feedback.map(f => f.comment).join(' ')}&quot;</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredExchanges.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeFilter === 'all' ? 'No Exchanges Yet' : `No ${activeFilter} Exchanges`}
            </h3>
            <p className="text-gray-600 mb-8">
              {activeFilter === 'all' 
                ? 'Start your learning journey by scheduling your first skill exchange'
                : `You don't have any ${activeFilter} exchanges at the moment`
              }
            </p>
            <button 
              onClick={() => router.push('/exchanges/new')}
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Start New Exchange
            </button>
          </div>
        )}
      </div>
    </div>
  );
}