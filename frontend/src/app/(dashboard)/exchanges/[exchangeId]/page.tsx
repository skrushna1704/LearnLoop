'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader, Check, X, ArrowLeft, AlertCircle, BookOpen, Users, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui';

// Enhanced interface for exchange details
interface IExchange {
  _id: string;
  title: string;
  proposer: {
    _id: string;
    profile: {
      name: string;
      profilePicture?: string;
      bio?: string;
    }
  };
  receiver: {
    _id: string;
    profile: {
      name: string;
      profilePicture?: string;
      bio?: string;
    }
  };
  users: Array<{
    user: {
      _id: string;
      profile: {
        name: string;
        profilePicture?: string;
        bio?: string;
      }
    };
    role: 'teacher' | 'learner' | 'both';
    skill: {
      _id: string;
      name: string;
    };
  }>;
  status: 'pending' | 'active' | 'completed' | 'rejected' | 'scheduled';
  message?: string;
  proposedDuration?: number;
  sessionType?: string;
  location?: string;
  preferredTimes?: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
}

export default function ExchangeReviewPage() {
  const { exchangeId } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [exchange, setExchange] = useState<IExchange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!exchangeId) return;

    const fetchExchangeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token not found.');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges/${exchangeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exchange details');
        }

        const data = await response.json();
        console.log('Exchange data received:', data); // Debug log
        setExchange(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeDetails();
  }, [exchangeId]);

  const handleStatusUpdate = async (status: 'active' | 'rejected') => {
    setIsUpdating(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found.');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges/${exchangeId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || `Failed to ${status === 'active' ? 'accept' : 'reject'} the proposal.`;
        
        // Handle specific HTTP status codes
        switch (response.status) {
          case 403:
            errorMessage = 'You are not authorized to perform this action. Only the receiver can accept or reject proposals.';
            break;
          case 404:
            errorMessage = 'Exchange not found. It may have been deleted or you may not have permission to view it.';
            break;
          case 400:
            errorMessage = errorData.message || 'Invalid request. Please check the exchange status and try again.';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later.';
            break;
          default:
            errorMessage = errorData.message || `Failed to ${status === 'active' ? 'accept' : 'reject'} the proposal.`;
        }
        
        throw new Error(errorMessage);
      }

      // Redirect back to the exchanges list on success
      router.push('/exchanges');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while updating the status.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if current user is the proposer
  const isCurrentUserProposer = () => {
    return exchange && currentUser && exchange.proposer._id === currentUser.id;
  };

  // Check if current user is the receiver
  const isCurrentUserReceiver = () => {
    return exchange && currentUser && exchange.receiver._id === currentUser.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading exchange details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/exchanges')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Exchanges
          </Button>
        </div>
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Exchange Not Found</h2>
          <p className="text-gray-600 mb-6">The exchange you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          <Button onClick={() => router.push('/exchanges')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Exchanges
          </Button>
        </div>
      </div>
    );
  }

  // If user is the proposer, show a different view
  if (isCurrentUserProposer()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button 
            onClick={() => router.push('/exchanges')} 
            variant="outline" 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exchanges
          </Button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Proposal is Pending</h1>
              <p className="text-gray-600">You cannot review your own proposal. Please wait for {exchange.receiver?.profile?.name || "Unknown User"} to respond.</p>
            </div>

            {/* Show proposal details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Proposal Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Skills Exchange</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">You are teaching</p>
                        <p className="font-medium">
                          {exchange.users?.find(u => u.role === 'teacher')?.skill?.name || 'Unknown Skill'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">You want to learn</p>
                        <p className="font-medium">
                          {exchange.users?.find(u => u.role === 'learner')?.skill?.name || 'Unknown Skill'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Session Details</h3>
                  <div className="space-y-2 text-sm">
                    {exchange.proposedDuration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{exchange.proposedDuration} minutes</span>
                      </div>
                    )}
                    {exchange.sessionType && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{exchange.sessionType}</span>
                      </div>
                    )}
                    {exchange.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{exchange.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {exchange.message && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Your Message</h3>
                  <p className="text-gray-600 bg-white p-3 rounded border">{exchange.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not the receiver, show unauthorized message
  if (!isCurrentUserReceiver()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to review this exchange proposal.</p>
          <Button onClick={() => router.push('/exchanges')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Exchanges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          onClick={() => router.push('/exchanges')} 
          variant="outline" 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exchanges
        </Button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Review Exchange Proposal</h1>
            <p className="text-blue-100">From: <strong>{exchange.proposer?.profile?.name || 'Unknown User'}</strong></p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Skills Exchange Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Exchange</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">They are teaching</h3>
                  </div>
                  <p className="text-lg font-semibold text-blue-800">
                    {exchange.users?.find(u => u.role === 'teacher')?.skill?.name || 'Unknown Skill'}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">You will teach</h3>
                  </div>
                  <p className="text-lg font-semibold text-purple-800">
                    {exchange.users?.find(u => u.role === 'learner')?.skill?.name || 'Unknown Skill'}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {exchange.proposedDuration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{exchange.proposedDuration} minutes</p>
                      </div>
                    </div>
                  )}
                  {exchange.sessionType && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Session Type</p>
                        <p className="font-medium capitalize">{exchange.sessionType}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {exchange.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{exchange.location}</p>
                      </div>
                    </div>
                  )}
                  {exchange.preferredTimes && exchange.preferredTimes.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Preferred Times</p>
                        <p className="font-medium">{exchange.preferredTimes.length} time slots</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message */}
            {exchange.message && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Message from {exchange.proposer?.profile?.name || 'Unknown User'}</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{exchange.message}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 w-full">
              <Button 
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                variant="outline"
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <X className="w-4 h-4" />
                <span className="truncate">{isUpdating ? 'Rejecting...' : 'Reject Proposal'}</span>
              </Button>
              <Button 
                onClick={() => handleStatusUpdate('active')}
                disabled={isUpdating}
                className="flex items-center gap-2 flex-1 bg-green-600 hover:bg-green-700 min-w-0"
              >
                <Check className="w-4 h-4" />
                <span className="truncate">{isUpdating ? 'Accepting...' : 'Accept Proposal'}</span>
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
