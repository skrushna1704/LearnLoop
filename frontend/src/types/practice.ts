export interface Category {
    name: string;
    icon: string;
    color: string;
    description: string;
  }
  
  export interface Question {
  id: number;
  _id?: string;
  title: string;
  category: string;
  difficulty: string;
  question: string;
  slug: string;
  interview_tip?: string;
  answer?: string[];
  references?: string[];
}
  
  export interface PracticeSession {
    sessionId: string;
    questions: Question[];
  }
  
  export interface UserProgress {
    category: string;
    totalQuestions: number;
    correctAnswers: number;
    averageScore: number;
    streak: number;
    badges: string[];
    lastPracticed: string;
  }