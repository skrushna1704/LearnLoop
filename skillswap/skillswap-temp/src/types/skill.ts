export interface Skill {
  name: string;
  category: string;
  level: string;
  description: string;
  experience?: string;
  isPublic?: boolean;
  type: 'teaching' | 'learning';
}

export interface SkillOffered {
  skillId: string;
  verified: boolean;
  portfolio: string[];
  experience: string;
  description: string;
  endorsements: number;
  name?: string;
  category?: string;
  level?: string;
}

export interface SkillNeeded {
  skillId: string;
  priority: number;
  learning_goals: string;
  experience: string;
  description: string;
  name?: string;
  category?: string;
  level?: string;
} 