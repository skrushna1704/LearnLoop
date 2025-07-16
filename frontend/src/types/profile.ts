export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillType = 'teaching' | 'learning';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  verified: boolean;
  endorsements: number;
  description?: string;
  experience?: string;
  certifications?: string[];
  lastUpdated: string;
  isPublic: boolean;
  type?: SkillType;
}

export interface ProfileData {
  email: string;
  verified?: boolean;
  profile?: {
    name?: string;
    profilePicture?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    website?: string;
  };
  joinedDate?: string;
  rating?: { 
    average: number; 
    count: number; 
  };
  stats?: {
    skillsTeaching?: number;
    skillsLearning?: number;
    connections?: number;
    completedExchanges?: number;
    totalHoursTeaching?: number;
    totalHoursLearning?: number;
    communityRank?: number;
    impactScore?: number;
  };
  skills: {
    teaching: Skill[];
    learning: Skill[];
  };
  achievements?: Achievement[];
  recentActivity?: Activity[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  date?: string;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

export type AddSkillType = {
  name: string;
  category: string;
  level: SkillLevel;
  description?: string;
  experience?: string;
  isPublic: boolean;
  type?: SkillType;
}

export interface UpdateSkillType {
  level?: SkillLevel;
  description?: string;
  category?: string;
}

export interface SkillsManagementProps {
  skills: Skill[];
  onAddSkill: (skill: AddSkillType) => Promise<void>;
  onDeleteSkill: (id: string) => Promise<void>;
  onUpdateSkill: (id: string, updates: UpdateSkillType) => Promise<void>;
  onRequestVerification?: (id: string) => Promise<void>;
  editable?: boolean;
  showEndorsements?: boolean;
  className?: string;
  type?: SkillType;
} 
