'use client';

import React, { useEffect, useState } from 'react';
import { Lightbulb, Rocket, AlertTriangle } from 'lucide-react';

interface Suggestion {
  id: number;
  text: string;
}

export default function AiCoachWidget() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log("AiCoachWidget: Starting to fetch suggestions...");
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error("AiCoachWidget: Auth token not found in localStorage.");
        setError("Authentication token not found. Please ensure you are logged in.");
        setIsLoading(false);
        return;
      }
      
      console.log("AiCoachWidget: Token found. Fetching from API...");
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/ai/suggestions`;
      console.log(`AiCoachWidget: Requesting URL: ${apiUrl}`);

      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(`AiCoachWidget: API request failed with status ${response.status}`);
          throw new Error('Failed to fetch suggestions.');
        }

        const data = await response.json();
        console.log("AiCoachWidget: Suggestions received.", data);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("AiCoachWidget: An error occurred during fetch.", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse h-12 w-full"></div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100/60 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      );
    }
    
    if (suggestions.length === 0) {
        return (
             <div className="bg-green-100/60 p-4 rounded-lg flex items-center gap-3">
                <Rocket className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">Your profile is looking great! No immediate suggestions.</p>
            </div>
        );
    }

    return (
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white p-4 rounded-lg flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
            <Rocket className="w-5 h-5 text-secondary flex-shrink-0" />
            <p className="text-sm text-gray-700 flex-grow">{suggestion.text}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Your AI Profile Coach</h3>
          <p className="text-gray-500">Actionable tips to improve your profile!</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
} 