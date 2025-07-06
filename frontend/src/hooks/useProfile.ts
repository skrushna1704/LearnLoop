import { useState, useEffect, useCallback } from 'react';

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
    availability?: any[];
  };
  skills_offered?: any[];
  skills_needed?: any[];
  rating?: {
    average: number;
    count: number;
  };
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
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
} 