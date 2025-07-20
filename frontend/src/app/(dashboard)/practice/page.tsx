
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Trophy, 
  CheckCircle, 
  TrendingUp,
  Play,
  ArrowLeft,
  Target,
  Award,
  Zap,
  Brain,
  ChevronRight,
  Users,
  BarChart3,
  Timer,
  CheckCircle2,
  XCircle as X,
  Lightbulb,
  ExternalLink,
  Medal,
  Flame,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common';
import SessionCompletionModal from '@/components/practice/SessionCompletionModal';
import ReviewSessionModal from '@/components/practice/ReviewSessionModal';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { PracticeSession, UserProgress } from '@/types/practice';
import { categories, difficulties } from '@/data/constants';

export default function PracticePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Beginner');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [interviewTip, setInterviewTip] = useState<string>('');
  const [references, setReferences] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{userId: string; user: {profile: {name: string}}; category: string; averageScore: number}>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    category: string;
    difficulty: string;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);

  // Timer for question
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession && !isAnswerSubmitted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession, isAnswerSubmitted]);

  // Load user progress and leaderboard
  useEffect(() => {
    loadUserProgress();
    loadLeaderboard();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data } = await apiClient.get('/practice/progress');
      setUserProgress(data.progress || []);
    } catch (error: unknown) {
      console.error('Error loading progress:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const { data } = await apiClient.get('/practice/leaderboard');
      setLeaderboard(data);
    } catch (error: unknown) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const startPracticeSession = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    // DSA: route to compiler with params
    if (selectedCategory === 'DSA') {
      router.push(`/practice/compiler?count=${questionCount}&difficulty=${selectedDifficulty}`);
      return;
    }

    setSessionLoading(true);
    try {
      const { data } = await apiClient.post('/practice/session', {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        questionCount
      });
      setCurrentSession(data);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setIsAnswerSubmitted(false);
      setTimeSpent(0);
      toast.success('Practice session started!');
    } catch {
      toast.error('Failed to start practice session');
    } finally {
      setSessionLoading(false);
    }
  };

  const submitAnswer = async () => {
    console.log('Current session questions:', currentSession?.questions);
    console.log('User answer:', userAnswer);
    console.log('Question ID:', currentSession?.questions[currentQuestionIndex]._id);
    
    if (!userAnswer.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post(`/practice/session/${currentSession?.sessionId}/answer`, {
        questionId: currentSession?.questions[currentQuestionIndex]._id,
        answer: userAnswer,
        timeSpent
      });
      
      console.log('API Response:', data);
      console.log('Is Correct:', data.isCorrect);
      console.log('Correct Answers:', data.correctAnswers);
      console.log('AI Feedback:', data.aiFeedback);
      console.log('Confidence:', data.confidence);
      
      setIsCorrect(data.isCorrect);
      setCorrectAnswers(data.correctAnswers);
      setInterviewTip(data.interview_tip);
      setReferences(data.references);
      setIsAnswerSubmitted(true);

      if (data.isCorrect) {
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect answer. Check the explanation below.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentSession?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswerSubmitted(false);
      setTimeSpent(0);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    try {
      const { data } = await apiClient.post(`/practice/session/${currentSession?.sessionId}/complete`);
      
      // Store populated session questions for review
      if (data.session?.questions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reviewQuestions = data.session.questions.map((q: any) => ({
          _id: q.questionId._id,
          title: q.questionId.title,
          question: q.questionId.question,
          difficulty: q.questionId.difficulty,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
          timeSpent: q.timeSpent,
          correctAnswers: q.questionId.answer,
          interview_tip: q.questionId.interview_tip,
          references: q.questionId.references,
          aiFeedback: q.aiFeedback,
          confidence: q.confidence
        }));
        setSessionQuestions(reviewQuestions);
      }
      
      // Set session result and show modal
      setSessionResult({
        score: data.score,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        category: selectedCategory,
        difficulty: selectedDifficulty
      });
      setShowCompletionModal(true);
      
      // Reset session
      setCurrentSession(null);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setIsAnswerSubmitted(false);
      setTimeSpent(0);
      
      // Reload progress
      loadUserProgress();
      loadLeaderboard();
    } catch {
      toast.error('Failed to complete session');
    }
  };

  const handleReviewAnswers = () => {
    setShowCompletionModal(false);
    setShowReviewModal(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressForCategory = (category: string) => {
    return userProgress.find(p => p.category === category);
  };

  if (currentSession) {
    const currentQuestion = currentSession.questions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-5xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentSession(null)}
              className="mb-4 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice
            </Button>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedCategory} Practice
                </h1>
                <p className="text-slate-600 mt-1">
                  Question {currentQuestionIndex + 1} of {currentSession.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg">
                  <Timer className="w-4 h-4 text-slate-600" />
                  <span className="font-mono text-lg">{formatTime(timeSpent)}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {Math.round(((currentQuestionIndex + 1) / currentSession.questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / currentSession.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge 
                  variant="outline" 
                  className={`px-3 py-1 ${
                    currentQuestion.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                    currentQuestion.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {currentQuestion.difficulty}
                </Badge>
                <div className="flex items-center gap-2 text-slate-500">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm">Technical Interview</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">
                {currentQuestion.title}
              </h2>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                <p className="text-slate-700 leading-relaxed text-lg">
                  {currentQuestion.question}
                </p>
              </div>

              {!isAnswerSubmitted ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Your Answer
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your detailed answer here..."
                      className="w-full p-4 border border-slate-300 rounded-xl resize-none h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                  
                  <Button 
                    onClick={submitAnswer}
                    disabled={loading || !userAnswer.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner />
                        Evaluating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Submit Answer
                      </div>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Result Card */}
                  <div className={`p-6 rounded-xl border-2 ${
                    isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <X className="w-6 h-6 text-red-600" />
                      )}
                      <span className={`text-xl font-bold ${
                        isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isCorrect ? 'Excellent!' : 'Not Quite Right'}
                      </span>
                    </div>
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-slate-600 mb-2">Your answer:</p>
                      <p className="text-slate-800">{userAnswer}</p>
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-blue-800">Correct Answer</h4>
                    </div>
                    <ul className="space-y-2">
                      {correctAnswers.map((answer, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{answer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interview Tip */}
                  {interviewTip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                        <h4 className="font-bold text-amber-800">Interview Tip</h4>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{interviewTip}</p>
                    </div>
                  )}

                  {/* References */}
                  {references && references.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-slate-600" />
                        <h4 className="font-bold text-slate-800">Further Reading</h4>
                      </div>
                      <ul className="space-y-2">
                        {references.map((ref, index) => (
                          <li key={index}>
                            <a 
                              href={ref} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="hover:underline">{ref}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Button */}
                  <Button 
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02]"
                  >
                    {currentQuestionIndex < currentSession.questions.length - 1 ? (
                      <div className="flex items-center gap-2">
                        <span>Next Question</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Complete Session
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Practice & Quiz
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Test your knowledge and track your progress across different technologies
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => router.push('/quiz')}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all"
            >
              <HelpCircle className="w-5 h-5" />
              Quiz Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Categories Section */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Choose Your Challenge</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => {
                    const progress = getProgressForCategory(category.name);
                    return (
                      <div
                        key={category.name}
                        className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedCategory === category.name
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{category.name}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-3">{category.description}</p>
                            {progress && (
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-500">
                                  {progress.averageScore}% average score
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {selectedCategory === category.name && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Session Settings */}
            {selectedCategory && (
              <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Session Settings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-4">Difficulty Level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {difficulties.map((difficulty) => (
                          <button
                            key={difficulty.name}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              selectedDifficulty === difficulty.name
                                ? difficulty.color + ' shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            onClick={() => setSelectedDifficulty(difficulty.name)}
                          >
                            {difficulty.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-4">Number of Questions</label>
                      <select
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value={5}>5 Questions (Quick)</option>
                        <option value={10}>10 Questions (Standard)</option>
                        <option value={15}>15 Questions (Extended)</option>
                        <option value={20}>20 Questions (Marathon)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={startPracticeSession}
                      disabled={sessionLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {sessionLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner />
                          Setting up session...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Play className="w-5 h-5" />
                          Start Practice Session
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Progress */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Your Progress</h2>
                </div>
                
                {userProgress.length > 0 ? (
                  <div className="space-y-4">
                    {userProgress.slice(0, 5).map((progress) => (
                      <div key={progress.category} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-slate-800">{progress.category}</div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-800">{progress.averageScore}%</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>{progress.totalQuestions} questions</span>
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>{progress.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No practice sessions yet</p>
                    <p className="text-sm text-slate-400 mt-1">Start practicing to see your progress</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Leaderboard</h2>
                </div>
                
                {leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((user, index) => (
                      <div key={user.userId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-slate-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {index < 3 ? <Medal className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{user.user.profile.name}</div>
                          <div className="text-sm text-slate-600">{user.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">{user.averageScore}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No leaderboard data yet</p>
                    <p className="text-sm text-slate-400 mt-1">Be the first to start practicing!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Session Completion Modal */}
      {sessionResult && (
        <SessionCompletionModal
          isOpen={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            setSessionResult(null);
          }}
          onReviewAnswers={handleReviewAnswers}
          sessionData={sessionResult}
        />
      )}

      {/* Review Session Modal */}
      {sessionResult && sessionQuestions.length > 0 && (
        <ReviewSessionModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSessionResult(null);
            setSessionQuestions([]);
          }}
          sessionData={{
            questions: sessionQuestions,
            score: sessionResult.score,
            totalQuestions: sessionResult.totalQuestions,
            correctAnswers: sessionResult.correctAnswers,
            category: sessionResult.category,
            difficulty: sessionResult.difficulty
          }}
        />
      )}
    </div>
  );
}