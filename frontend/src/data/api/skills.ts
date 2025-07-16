// API functions for interacting with the backend Skill endpoints

import { apiClient } from '@/lib/api-client';
import { Skill } from '@/types/skill';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api'}/skills`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

type CreateSkillParams = {
  name: string;
  description: string;
  category: string;
  level: string;
  experience?: string;
  type?: 'teaching' | 'learning';
};

export async function createSkill({ name, description, category, level, experience, type = 'teaching' }: CreateSkillParams) {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description, category, level, experience, type })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to create skill' }));
    throw new Error(error.message || 'Failed to create skill');
  }
  return res.json();
}

export async function getAllSkills() {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch skills' }));
    throw new Error(error.message || 'Failed to fetch skills');
  }
  return res.json();
}

export async function addTeacherToSkill(skillId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/${skillId}/teach`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to add teacher to skill' }));
    throw new Error(error.message || 'Failed to add teacher to skill');
  }
  return res.json();
}

export async function addLearnerToSkill(skillId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/${skillId}/learn`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to add learner to skill' }));
    throw new Error(error.message || 'Failed to add learner to skill');
  }
  return res.json();
}

// Additional useful functions
export async function getSkillById(skillId: string) {
  const res = await fetch(`${BASE_URL}/${skillId}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch skill' }));
    throw new Error(error.message || 'Failed to fetch skill');
  }
  return res.json();
}

export async function updateSkill(skillId: string, updates: Partial<CreateSkillParams>) {
  const res = await fetch(`${BASE_URL}/${skillId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to update skill' }));
    throw new Error(error.message || 'Failed to update skill');
  }
  return res.json();
}

export async function deleteSkill(skillId: string) {
  const res = await fetch(`${BASE_URL}/${skillId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to delete skill' }));
    throw new Error(error.message || 'Failed to delete skill');
  }
  return res.json();
}

export const addSkill = async (skillData: Partial<Skill>) => {
  try {
    const { name, category, level, description, experience, type } = skillData;
    
    // Send only the necessary fields for skill creation
    const payload = {
      name,
      category,
      level,
      description,
      experience,
      type
    };

    const response = await apiClient.post('/skills', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};
