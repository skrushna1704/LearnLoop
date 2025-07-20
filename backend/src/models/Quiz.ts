import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion extends Document {
  id: number;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: {
    id: string; // 'a', 'b', 'c'
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  interview_tip?: string;
  references?: string[];
  timeLimit?: number;
  points: number;
  slug: string;
}

export interface IQuizSession extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  difficulty: string;
  questions: {
    questionId: mongoose.Types.ObjectId;
    selectedOption?: string;
    isCorrect?: boolean;
    timeSpent: number;
    points: number;
  }[];
  score: number;
  totalQuestions: number;
  totalPoints: number;
  completedAt?: Date;
  createdAt: Date;
}

export interface IQuizProgress extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  lastQuizDate: Date;
  streak: number;
  badges: string[];
}

const QuizQuestionSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  question: { type: String, required: true },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: { type: String, required: true },
  interview_tip: { type: String },
  references: [{ type: String }],
  timeLimit: { type: Number, default: 60 },
  points: { type: Number, default: 1 },
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

const QuizSessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'QuizQuestion', required: true },
    selectedOption: { type: String },
    isCorrect: { type: Boolean },
    timeSpent: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  }],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  totalPoints: { type: Number, default: 0 },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const QuizProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  totalQuizzes: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  lastQuizDate: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  badges: [{ type: String }]
}, { timestamps: true });

// Compound index for quiz progress
QuizProgressSchema.index({ userId: 1, category: 1 }, { unique: true });

export const QuizQuestion = mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);
export const QuizSession = mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema);
export const QuizProgress = mongoose.model<IQuizProgress>('QuizProgress', QuizProgressSchema); 