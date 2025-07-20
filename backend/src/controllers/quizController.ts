import { Request, Response } from 'express';
import { QuizQuestion, QuizSession, QuizProgress } from '../models/Quiz';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get quiz session
// @route   GET /api/quiz/session/:sessionId
export const getQuizSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = (req as any).user.id;

  const session = await QuizSession.findById(sessionId);
  if (!session || session.userId.toString() !== userId) {
    res.status(404);
    throw new Error('Quiz session not found');
  }

  // Get questions for this session
  const questionIds = session.questions.map(q => q.questionId);
  const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

  // Return questions without correct answers
  const questionsForUser = questions.map(q => ({
    ...q.toObject(),
    options: q.options.map((opt: { id: string; text: string; isCorrect: boolean }) => ({
      id: opt.id,
      text: opt.text
      // Don't send isCorrect to frontend
    }))
  }));

  res.json({
    sessionId: session._id,
    questions: questionsForUser,
    category: session.category,
    difficulty: session.difficulty,
    totalQuestions: session.totalQuestions
  });
});

// @desc    Get quiz categories
// @route   GET /api/quiz/categories
export const getQuizCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await QuizQuestion.distinct('category');
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  
  res.json({
    categories,
    difficulties
  });
});

// @desc    Get quiz questions
// @route   GET /api/quiz/questions
export const getQuizQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { category, difficulty, limit = 10 } = req.query;

  const query: any = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const questions = await QuizQuestion.aggregate([
    { $match: query },
    { $sample: { size: parseInt(limit as string) } },
    { $project: { 
      _id: 1,
      id: 1, 
      title: 1, 
      category: 1, 
      difficulty: 1, 
      question: 1,
      options: 1,
      timeLimit: 1,
      points: 1,
      slug: 1
    }}
  ]);

  res.json(questions);
});

// @desc    Start quiz session
// @route   POST /api/quiz/session
export const startQuizSession = asyncHandler(async (req: Request, res: Response) => {
  const { category, difficulty, questionCount = 10 } = req.body;
  const userId = (req as any).user.id;

  const questions = await QuizQuestion.aggregate([
    { $match: { category, difficulty } },
    { $sample: { size: questionCount } },
    { $project: {
      _id: 1,
      id: 1,
      title: 1,
      category: 1,
      difficulty: 1,
      question: 1,
      options: 1,
      timeLimit: 1,
      points: 1,
      slug: 1
    }}
  ]);

  if (questions.length === 0) {
    res.status(404);
    throw new Error('No quiz questions found for the specified category and difficulty');
  }

  const session = new QuizSession({
    userId,
    category,
    difficulty,
    questions: questions.map(q => ({ 
      questionId: q._id, 
      timeSpent: 0,
      points: 0
    })),
    totalQuestions: questions.length
  });

  await session.save();

  // Return questions without correct answers
  const questionsForUser = questions.map(q => ({
    ...q,
    options: q.options.map((opt: { id: string; text: string; isCorrect: boolean }) => ({
      id: opt.id,
      text: opt.text
      // Don't send isCorrect to frontend
    }))
  }));

  res.status(201).json({
    sessionId: session._id,
    questions: questionsForUser
  });
});

// @desc    Submit quiz answer
// @route   POST /api/quiz/session/:sessionId/answer
export const submitQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { questionId, selectedOption, timeSpent } = req.body;
  const userId = (req as any).user.id;

  const session = await QuizSession.findById(sessionId);
  if (!session || session.userId.toString() !== userId) {
    res.status(404);
    throw new Error('Quiz session not found');
  }

  const question = await QuizQuestion.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Check if answer is correct
  const correctOption = question.options.find(opt => opt.isCorrect);
  const isCorrect = correctOption?.id === selectedOption;
  const points = isCorrect ? question.points : 0;

  // Update session
  const questionIndex = session.questions.findIndex(q => 
    q.questionId.toString() === questionId
  );

  if (questionIndex !== -1) {
    session.questions[questionIndex].selectedOption = selectedOption;
    session.questions[questionIndex].isCorrect = isCorrect;
    session.questions[questionIndex].timeSpent = timeSpent;
    session.questions[questionIndex].points = points;
  }

  await session.save();

  res.json({
    isCorrect,
    correctOption: correctOption?.id,
    explanation: question.explanation,
    interview_tip: question.interview_tip,
    points
  });
});

// @desc    Complete quiz session
// @route   POST /api/quiz/session/:sessionId/complete
export const completeQuizSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = (req as any).user.id;

  const session = await QuizSession.findById(sessionId);
  if (!session || session.userId.toString() !== userId) {
    res.status(404);
    throw new Error('Quiz session not found');
  }

  // Calculate final score
  const correctAnswers = session.questions.filter(q => q.isCorrect).length;
  const totalPoints = session.questions.reduce((sum, q) => sum + q.points, 0);
  const score = Math.round((correctAnswers / session.totalQuestions) * 100);

  session.score = score;
  session.totalPoints = totalPoints;
  session.completedAt = new Date();
  await session.save();

  // Update quiz progress
  await updateQuizProgress(userId, session.category, session.totalQuestions, correctAnswers, score);

  res.json({
    score,
    totalQuestions: session.totalQuestions,
    correctAnswers,
    totalPoints,
    session
  });
});

// @desc    Get quiz progress
// @route   GET /api/quiz/progress
export const getQuizProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const progress = await QuizProgress.find({ userId }).sort({ category: 1 });
  
  res.json({
    progress: progress || []
  });
});

// @desc    Get quiz leaderboard
// @route   GET /api/quiz/leaderboard
export const getQuizLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const { category, difficulty } = req.query;

  const matchStage: any = {};
  if (category) matchStage.category = category;
  if (difficulty) matchStage.difficulty = difficulty;

  const leaderboard = await QuizSession.aggregate([
    { $match: { ...matchStage, completedAt: { $exists: true } } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $group: {
        _id: '$userId',
        user: { $first: '$user' },
        category: { $first: '$category' },
        averageScore: { $avg: '$score' },
        totalQuizzes: { $sum: 1 },
        bestScore: { $max: '$score' }
      }
    },
    { $sort: { averageScore: -1 } },
    { $limit: 10 }
  ]);

  res.json(leaderboard);
});

// Helper function to update quiz progress
async function updateQuizProgress(
  userId: string, 
  category: string, 
  totalQuestions: number, 
  correctAnswers: number, 
  score: number
) {
  let progress = await QuizProgress.findOne({ userId, category });
  
  if (!progress) {
    progress = new QuizProgress({
      userId,
      category,
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      streak: 0,
      badges: []
    });
  }

  progress.totalQuizzes += 1;
  progress.totalQuestions += totalQuestions;
  progress.correctAnswers += correctAnswers;
  progress.averageScore = Math.round(
    (progress.averageScore * (progress.totalQuizzes - 1) + score) / progress.totalQuizzes
  );
  
  if (score > progress.bestScore) {
    progress.bestScore = score;
  }

  progress.lastQuizDate = new Date();

  // Update streak
  const lastQuiz = new Date(progress.lastQuizDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastQuiz.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }

  // Add badges
  if (score >= 90 && !progress.badges.includes('quiz_expert')) {
    progress.badges.push('quiz_expert');
  }
  if (progress.streak >= 7 && !progress.badges.includes('quiz_consistent')) {
    progress.badges.push('quiz_consistent');
  }
  if (progress.totalQuizzes >= 50 && !progress.badges.includes('quiz_dedicated')) {
    progress.badges.push('quiz_dedicated');
  }

  await progress.save();
} 