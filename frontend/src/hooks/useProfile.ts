import { useState, useEffect, useCallback } from 'react';

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
  verified: boolean;
  endorsements: number;
}

interface Rating {
  average: number;
  count: number;
}

export interface ProfileData {
  email: string;
  isProfileComplete?: boolean;
  name?: string;
  profile?: {
    name?: string;
    profilePicture?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    website?: string;
    availability?: Availability[];
  };
  skills_offered?: Skill[];
  skills_needed?: Skill[];
  rating?: Rating;
  createdAt?: string;
  updatedAt?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');
      const response = await fetch(`${apiUrl}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
} 