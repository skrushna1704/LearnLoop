export interface ApiSkill {
    _id?: string;
    name: string;
    level: string;
    category?: string;
    description?: string;
    experience?: string;
    verified?: boolean;
    portfolio?: string[];
    endorsements?: number;
    priority?: number;
    learning_goals?: string;
    students?: number;
    rating?: number;
    hours?: number;
    teachers?: number;
    progress?: number;
  }

  export interface Teacher {
    _id: string;
    name: string;
    rating: number;
    profilePicture?: string;
  }
  
  export interface Skill {
    _id: string;
    name: string;
    description: string;
    category: string;
    level: string;
    teachers: Teacher[];
    learners: string[];
    popularity?: number;
    tags?: string[];
  }

  export interface UserReference {
    _id: string;
    profile: {
      name?: string;
      profilePicture?: string;
      role?: string;
      rating?: number;
      verified?: boolean;
    }
  }
  
  export interface IExchange {
    _id: string;
    title: string;
    proposer: UserReference;
    receiver: UserReference;
    status: 'pending' | 'active' | 'completed' | 'rejected' | 'scheduled';
    myRole?: 'teacher' | 'learner' | 'both'; 
    offeredSkill?: { name: string; description?: string };
    desiredSkill?: { name: string; description?: string };
    // Keep the old fields for backward compatibility
    skillTaught?: { name: string };
    skillLearned?: { name: string };
    // Add users array for skill data
    users?: Array<{
      user: UserReference;
      role: 'teacher' | 'learner' | 'both';
      skill?: { name: string; description?: string };
    }>;
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
  

  // Define interfaces for our data structures
export interface Message {
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
  
  export interface Conversation {
    _id: string;
    proposer: { _id: string; profile: { name: string; profilePicture: string } };
    receiver: { _id: string; profile: { name: string; profilePicture: string } };
    title: string;
    status: 'pending' | 'active' | 'completed';
    lastMessage?: string;
    lastMessageTime?: string;
    unread?: number;
  }
  
  export interface FileData {
    type: string;
    url: string;
    name: string;
    mime: string;
  }