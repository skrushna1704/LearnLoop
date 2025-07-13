import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  id: number;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  answer: string[];
  example: string;
  interview_tip?: string;
  references?: string[];
  slug: string;
}

export interface IPracticeSession extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  difficulty: string;
  questions: {
    questionId: mongoose.Types.ObjectId;
    userAnswer?: string;
    isCorrect?: boolean;
    timeSpent: number;
  }[];
  score: number;
  totalQuestions: number;
  completedAt?: Date;
  createdAt: Date;
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  lastPracticed: Date;
  streak: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  question: { type: String, required: true },
  answer: [{ type: String }],
  interview_tip: { type: String },
  references: [{ type: String }],
  slug: { type: String, required: true, unique: true },
  example: { type: String } 
}, { timestamps: true });

const PracticeSessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    userAnswer: { type: String },
    isCorrect: { type: Boolean },
    timeSpent: { type: Number, default: 0 }
  }],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const UserProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  lastPracticed: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  badges: [{ type: String }]
}, { timestamps: true });

// Compound index for user progress
UserProgressSchema.index({ userId: 1, category: 1 }, { unique: true });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export const PracticeSession = mongoose.model<IPracticeSession>('PracticeSession', PracticeSessionSchema);
export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema); 