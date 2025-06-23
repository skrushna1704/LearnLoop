'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader, Check, X } from 'lucide-react';

// Simplified interface for now
interface IExchange {
  _id: string;
  title: string;
  proposer: {
    _id: string;
    profile: {
      name: string;
    }
  };
  // Add other fields as needed
}

export default function ExchangeReviewPage() {
  const { exchangeId } = useParams();
  const router = useRouter();
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
    console.log("clicked")
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
        throw new Error(`Failed to ${status === 'active' ? 'accept' : 'reject'} the proposal.`);
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin h-12 w-12 text-blue-500" /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-lg">Error: {error}</div>;
  }

  if (!exchange) {
    return <div>Exchange not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Review Exchange Proposal</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">{exchange.title}</h2>
        <p className="text-gray-600 mt-2">
          From: <strong>{exchange.proposer.profile.name}</strong>
        </p>
        
        <div className="mt-6 flex gap-4">
          <button 
            onClick={() => handleStatusUpdate('active')}
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            <Check /> {isUpdating ? 'Accepting...' : 'Accept'}
          </button>
          <button 
            onClick={() => handleStatusUpdate('rejected')}
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
          >
            <X /> {isUpdating ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}
