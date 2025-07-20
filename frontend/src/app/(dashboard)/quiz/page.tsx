'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Trophy, 
  CheckCircle, 
  Play,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common';
import toast from 'react-hot-toast';
import { quizService, QuizProgress, QuizLeaderboardEntry } from '@/data/services/quizService';
import { categories, difficulties } from '@/data/constants';



export default function QuizPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Beginner');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>([]);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);

  // Load quiz progress and leaderboard
  useEffect(() => {
    loadQuizProgress();
    loadLeaderboard();
  }, []);

  const loadQuizProgress = async () => {
    try {
      const progress = await quizService.getProgress();
      setQuizProgress(progress);
    } catch (error: unknown) {
      console.error('Error loading quiz progress:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const leaderboardData = await quizService.getLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (error: unknown) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const startQuizSession = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    setSessionLoading(true);
    try {
      const { sessionId, questions } = await quizService.startSession(
        selectedCategory,
        selectedDifficulty,
        questionCount
      );
      
      // Store session data in localStorage for the quiz session page
      const sessionData = {
        sessionId,
        questions,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        totalQuestions: questionCount
      };
      
      console.log('Storing session data:', sessionData);
      localStorage.setItem(`quiz_session_${sessionId}`, JSON.stringify(sessionData));
      console.log('Session data stored in localStorage');
      
      // Verify the data was stored
      const storedData = localStorage.getItem(`quiz_session_${sessionId}`);
      console.log('Verification - stored data:', storedData ? 'Found' : 'Not found');
      
      // Navigate to quiz session page
      console.log('Navigating to session page...');
      router.push(`/quiz/session/${sessionId}`);
      toast.success('Quiz session started!');
    } catch (error: unknown) {
      console.error('Quiz session error:', error);
      
      // Check if it's a "no questions found" error
      const errorMessage = error instanceof Error ? error.message : '';
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError?.response?.status === 404 || errorMessage.includes('No quiz questions found')) {
        toast.error(`🚧 Coming Soon! ${selectedCategory} questions are being prepared with quality content.`);
      } else {
        toast.error('Failed to start quiz session. Please try again.');
      }
    } finally {
      setSessionLoading(false);
    }
  };

  const getProgressForCategory = (category: string) => {
    return quizProgress.find(p => p.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Quiz Mode
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
            Test your knowledge with quick multiple-choice questions and compete with others
          </p>
          <div className="text-center text-xs text-gray-400 mt-2">
            Select any category to start your quiz. Some categories may be coming soon!
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => router.push('/practice')}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Practice Mode
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quiz Setup */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Start Quiz</h2>
                  <p className="text-gray-600">Choose your category and difficulty</p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const progress = getProgressForCategory(category.name);
                    
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedCategory === category.name
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                            {category.icon}
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-800">{category.name}</h4>
                            {progress ? (
                              <p className="text-sm text-gray-600">
                                Best: {progress.bestScore}% | Avg: {progress.averageScore}%
                              </p>
                            ) : (
                              <p className="text-sm text-gray-600">Ready to start</p>
                            )}
                          </div>
                        </div>
                        {selectedCategory === category.name && (
                          <CheckCircle className="w-5 h-5 text-blue-500 ml-auto mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Difficulty</h3>
                <div className="grid grid-cols-3 gap-4">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.name}
                      onClick={() => setSelectedDifficulty(difficulty.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDifficulty === difficulty.name
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <Badge className={`${difficulty.color} mb-2`}>
                          {difficulty.name}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          {difficulty.name === 'Beginner' && 'Basic concepts'}
                          {difficulty.name === 'Intermediate' && 'Advanced topics'}
                          {difficulty.name === 'Advanced' && 'Expert level'}
                        </p>
                      </div>
                      {selectedDifficulty === difficulty.name && (
                        <CheckCircle className="w-5 h-5 text-purple-500 mx-auto mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Number of Questions</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[5, 10, 15].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        questionCount === count
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{count}</div>
                        <p className="text-sm text-gray-600">Questions</p>
                      </div>
                      {questionCount === count && (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startQuizSession}
                disabled={!selectedCategory || sessionLoading}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {sessionLoading ? (
                  <LoadingSpinner className="w-5 h-5" />
                ) : !selectedCategory ? (
                  <>
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Select a Category to Start
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </>
                )}
              </Button>
              
              {!selectedCategory && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Choose a category from the available options above to begin your quiz
                </p>
              )}
            </Card>
          </div>

          {/* Stats and Leaderboard */}
          <div className="space-y-6">
            {/* Quiz Stats */}
            <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-2 border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Quiz Stats</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Quizzes</span>
                  <span className="font-semibold">
                    {quizProgress.reduce((sum, p) => sum + p.totalQuizzes, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Score</span>
                  <span className="font-semibold text-green-600">
                    {Math.max(...quizProgress.map(p => p.bestScore), 0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold text-blue-600">
                    {quizProgress.length > 0 
                      ? Math.round(quizProgress.reduce((sum, p) => sum + p.averageScore, 0) / quizProgress.length)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold text-purple-600">
                    {Math.max(...quizProgress.map(p => p.streak), 0)} days
                  </span>
                </div>
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-6 bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
              </div>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={entry.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {entry.user?.profile?.name || 'Anonymous'}
                      </span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {Math.round(entry.averageScore)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 