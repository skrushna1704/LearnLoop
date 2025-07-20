import { Request, Response } from 'express';
import { Question, PracticeSession, UserProgress } from '../models/Practice';
import { asyncHandler } from '../utils/asyncHandler';
import { VM } from 'vm2';
import { evaluateAnswerWithAI, fallbackEvaluation } from '../utils/aiEvaluator';
const stringSimilarity = require('string-similarity');

// @desc    Get available categories and difficulties
// @route   GET /api/practice/categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Question.distinct('category');
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  
  res.json({
    categories,
    difficulties
  });
});

// @desc    Get questions for practice
// @route   GET /api/practice/questions
export const getQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { category, difficulty, limit = 10 } = req.query;
  const userId = (req as any).user.id;

  const query: any = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  // Get the count of available questions
  const availableCount = await Question.countDocuments(query);
  const sampleSize = Math.min(parseInt(limit as string), availableCount);

  // Get random questions (no repeats)
  const questions = await Question.aggregate([
    { $match: query },
    { $sample: { size: sampleSize } },
    { $project: { 
      id: 1, 
      title: 1, 
      category: 1, 
      difficulty: 1, 
      question: 1,
      slug: 1,
      interview_tip: 1,
      answer: 1,
      references: 1
    }}
  ]);

  res.json(questions);
});

// @desc    Start a practice session
// @route   POST /api/practice/session
export const startSession = asyncHandler(async (req: Request, res: Response) => {
  const { category, difficulty, questionCount = 10 } = req.body;
  const userId = (req as any).user.id;

  // Get random questions
  const questions = await Question.aggregate([
    { $match: { category, difficulty } },
    { $sample: { size: questionCount } },
    { $project: {
        id: 1,
        title: 1,
        category: 1,
        difficulty: 1,
        question: 1,
        slug: 1,
        interview_tip: 1,
        example: 1 
      }
    }
  ]);

  if (questions.length === 0) {
    res.status(404);
    throw new Error('No questions found for the specified category and difficulty');
  }

  // Create practice session
  const session = new PracticeSession({
    userId,
    category,
    difficulty,
    questions: questions.map(q => ({ questionId: q._id, timeSpent: 0 })),
    totalQuestions: questions.length
  });

  await session.save();

  // Return questions without answers
  const questionsForUser = questions.map(q => ({
    _id: q._id,
    id: q.id,
    title: q.title,
    category: q.category,
    difficulty: q.difficulty,
    question: q.question,
    slug: q.slug,
    interview_tip: q.interview_tip,
    example: q.example
  }));
  res.status(201).json({
    sessionId: session._id,
    questions: questionsForUser
  });
});

// @desc    Submit answer for a question
// @route   POST /api/practice/session/:sessionId/answer
export const submitAnswer = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { questionId, answer, timeSpent } = req.body;
  const userId = (req as any).user.id;

  const session = await PracticeSession.findById(sessionId);
  if (!session || session.userId.toString() !== userId) {
    res.status(404);
    throw new Error('Session not found');
  }

  // Get the correct answer
  const question = await Question.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // AI-powered answer evaluation using utility
  let isCorrect = false;
  let aiFeedback = '';
  let confidence = 0;
  
  try {
    const evaluation = await evaluateAnswerWithAI(answer, {
      question: question.question,
      category: question.category,
      answer: question.answer
    });
    
    isCorrect = evaluation.isCorrect;
    aiFeedback = evaluation.feedback;
    confidence = evaluation.confidence;
    
    // console.log('✅ AI Evaluation Result:', { isCorrect, aiFeedback, confidence });
  } catch (error) {
    // console.error('❌ AI evaluation failed, using fallback:', error);
    
    // Fallback to simple keyword matching
    const fallbackResult = fallbackEvaluation(answer, question.answer);
    isCorrect = fallbackResult.isCorrect;
    aiFeedback = fallbackResult.feedback;
    confidence = fallbackResult.confidence;
    
    console.log('🔄 Fallback Result:', { isCorrect, aiFeedback, confidence });
  }

  // Update session
  const questionIndex = session.questions.findIndex(q => 
    q.questionId.toString() === questionId
  );

  if (questionIndex !== -1) {
    session.questions[questionIndex].userAnswer = answer;
    session.questions[questionIndex].isCorrect = isCorrect;
    session.questions[questionIndex].timeSpent = timeSpent;
  }

  await session.save();

  res.json({
    isCorrect,
    correctAnswers: question.answer,
    interview_tip: question.interview_tip,
    references: question.references,
    aiFeedback: aiFeedback || null,
    confidence: confidence || null
  });
});

// @desc    Complete practice session
// @route   POST /api/practice/session/:sessionId/complete
export const completeSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = (req as any).user.id;

  const session = await PracticeSession.findById(sessionId);
  if (!session || session.userId.toString() !== userId) {
    res.status(404);
    throw new Error('Session not found');
  }

  // Calculate score
  const correctAnswers = session.questions.filter(q => q.isCorrect).length;
  const score = Math.round((correctAnswers / session.totalQuestions) * 100);

  session.score = score;
  session.completedAt = new Date();
  await session.save();

  // Update user progress
  await updateUserProgress(userId, session.category, session.totalQuestions, correctAnswers, score);

  // Populate session with question details for review
  const populatedSession = await PracticeSession.findById(sessionId)
    .populate({
      path: 'questions.questionId',
      model: 'Question',
      select: 'title question answer interview_tip references difficulty'
    });

  res.json({
    score,
    totalQuestions: session.totalQuestions,
    correctAnswers,
    session: populatedSession
  });
});

// @desc    Get user progress
// @route   GET /api/practice/progress
export const getUserProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const progress = await UserProgress.find({ userId }).sort({ updatedAt: -1 });
  
  // Get recent sessions
  const recentSessions = await PracticeSession.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    progress,
    recentSessions
  });
});

// @desc    Get leaderboard
// @route   GET /api/practice/leaderboard
export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;

  const query: any = {};
  if (category) query.category = category;

  const leaderboard = await UserProgress.aggregate([
    { $match: query },
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
      $project: {
        userId: 1,
        category: 1,
        averageScore: 1,
        totalQuestions: 1,
        streak: 1,
        'user.profile.name': 1,
        'user.profile.profilePicture': 1
      }
    },
    { $sort: { averageScore: -1, totalQuestions: -1 } },
    { $limit: 20 }
  ]);

  res.json(leaderboard);
});

// @desc    Run user code for a question
// @route   POST /api/practice/compile
export const runCode = asyncHandler(async (req: Request, res: Response) => {
  const { code, questionId } = req.body;
  if (!code || !questionId) {
    return res.status(400).json({ error: 'Code and questionId are required.' });
  }
  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found.' });
  }
  let output = '';
  let error = '';
  try {
    let logs: string[] = [];
    const vm = new VM({
      timeout: 2000,
      sandbox: {
        sandboxConsole: {
          log: (...args: any[]) => logs.push(args.join(' '))
        }
      }
    });
    const safeCode = code.replace(/console\.log/g, 'sandboxConsole.log');
    vm.run(safeCode);
    output = logs.join('\n');
  } catch (err: any) {
    error = err.message;
  }
  res.json({ output, error });
});

// Helper function to update user progress
async function updateUserProgress(
  userId: string, 
  category: string, 
  totalQuestions: number, 
  correctAnswers: number, 
  score: number
) {
  let progress = await UserProgress.findOne({ userId, category });
  
  if (!progress) {
    progress = new UserProgress({
      userId,
      category,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      streak: 0,
      badges: []
    });
  }

  // Update stats
  progress.totalQuestions += totalQuestions;
  progress.correctAnswers += correctAnswers;
  progress.averageScore = Math.round(
    (progress.averageScore * (progress.totalQuestions - totalQuestions) + score * totalQuestions) / progress.totalQuestions
  );
  progress.lastPracticed = new Date();

  // Update streak (simplified logic)
  const lastPracticed = new Date(progress.lastPracticed);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }

  // Add badges based on performance
  if (score >= 90 && !progress.badges.includes('expert')) {
    progress.badges.push('expert');
  }
  if (progress.streak >= 7 && !progress.badges.includes('consistent')) {
    progress.badges.push('consistent');
  }
  if (progress.totalQuestions >= 100 && !progress.badges.includes('dedicated')) {
    progress.badges.push('dedicated');
  }

  await progress.save();
} 