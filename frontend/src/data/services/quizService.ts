import { apiClient } from '@/lib/api-client';

export interface QuizQuestion {
  _id: string;
  id: number;
  title: string;
  category: string;
  difficulty: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  timeLimit?: number;
  points: number;
  slug: string;
}

export interface QuizSession {
  sessionId: string;
  questions: QuizQuestion[];
  category: string;
  difficulty: string;
  totalQuestions: number;
}

export interface QuizProgress {
  category: string;
  totalQuizzes: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  streak: number;
  badges: string[];
}

export interface QuizLeaderboardEntry {
  userId: string;
  user: {
    profile: {
      name: string;
    };
  };
  category: string;
  averageScore: number;
}

export const quizService = {
  // Get quiz categories
  getCategories: async (): Promise<string[]> => {
    const { data } = await apiClient.get('/quiz/categories');
    return data;
  },

  // Get quiz questions
  getQuestions: async (category?: string, difficulty?: string): Promise<QuizQuestion[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const { data } = await apiClient.get(`/quiz/questions?${params.toString()}`);
    return data;
  },

  // Start quiz session
  startSession: async (category: string, difficulty: string, questionCount: number): Promise<{ sessionId: string; questions: QuizQuestion[] }> => {
    const { data } = await apiClient.post('/quiz/session', {
      category,
      difficulty,
      questionCount
    });
    return data;
  },

  // Get quiz session
  getSession: async (sessionId: string): Promise<QuizSession> => {
    const { data } = await apiClient.get(`/quiz/session/${sessionId}`);
    return data;
  },

  // Submit quiz answer
  submitAnswer: async (
    sessionId: string, 
    questionId: string, 
    selectedOption: string, 
    timeSpent: number
  ): Promise<{
    isCorrect: boolean;
    correctOption: string;
    explanation: string;
    interview_tip: string;
    points: number;
  }> => {
    const { data } = await apiClient.post(`/quiz/session/${sessionId}/answer`, {
      questionId,
      selectedOption,
      timeSpent
    });
    return data;
  },

  // Complete quiz session
  completeSession: async (sessionId: string): Promise<{
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    totalPoints: number;
    timeSpent: number;
  }> => {
    const { data } = await apiClient.post(`/quiz/session/${sessionId}/complete`);
    return data;
  },

  // Get quiz progress
  getProgress: async (): Promise<QuizProgress[]> => {
    const { data } = await apiClient.get('/quiz/progress');
    return data.progress || [];
  },

  // Get quiz leaderboard
  getLeaderboard: async (): Promise<QuizLeaderboardEntry[]> => {
    const { data } = await apiClient.get('/quiz/leaderboard');
    return data;
  }
}; 