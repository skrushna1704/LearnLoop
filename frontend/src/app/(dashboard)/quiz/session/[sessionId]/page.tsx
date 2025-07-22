'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common';
import toast from 'react-hot-toast';
import { quizService, QuizSession } from '@/data/services/quizService';

// Using imported types from quizService

export default function QuizSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctOption, setCorrectOption] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [interviewTip, setInterviewTip] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // Timer for question
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session && !showResult) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session, showResult]);

  const loadSession = useCallback(async () => {
    try {
      console.log('Loading session for ID:', sessionId);
      
      // First try to get session from localStorage (if coming from quiz start)
      const sessionData = localStorage.getItem(`quiz_session_${sessionId}`);
      console.log('Session data from localStorage:', sessionData ? 'Found' : 'Not found');
      
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        console.log('Parsed session:', parsedSession);
        setSession(parsedSession);
        localStorage.removeItem(`quiz_session_${sessionId}`); // Clean up
      } else {
        // If not in localStorage, try to get from API
        console.log('Session not in localStorage, trying API...');
        try {
          const apiSession = await quizService.getSession(sessionId);
          console.log('Session from API:', apiSession);
          setSession(apiSession);
        } catch (apiError) {
          console.error('API session fetch failed:', apiError);
          toast.error('Session not found. Please start a new quiz.');
          router.push('/quiz');
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load quiz session');
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  }, [sessionId, router]);

  // Load session data
  useEffect(() => {
    // Add a small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      loadSession();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [loadSession]);

  const handleOptionSelect = async (optionId: string) => {
    if (showResult || submitting) return;
    
    setSelectedOption(optionId);
    setSubmitting(true);

    try {
      const currentQuestion = session?.questions[currentQuestionIndex];
      if (!currentQuestion) return;

      const result = await quizService.submitAnswer(
        sessionId,
        currentQuestion._id,
        optionId,
        timeSpent
      );

      setIsCorrect(result.isCorrect);
      setCorrectOption(result.correctOption);
      setExplanation(result.explanation);
      setInterviewTip(result.interview_tip);
      setPoints(result.points);
      setShowResult(true);

      if (result.isCorrect) {
        setScore(prev => prev + 1);
        setTotalPoints(prev => prev + result.points);
        toast.success('Correct!');
      } else {
        toast.error('Incorrect. Check the explanation below.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (session?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setTimeSpent(0);
    } else {
      completeSession();
    }
  };

  // const previousQuestion = () => {
  //   if (currentQuestionIndex > 0) {
  //     setCurrentQuestionIndex(prev => prev - 1);
  //     setSelectedOption(null);
  //     setShowResult(false);
  //     setTimeSpent(0);
  //   }
  // };

  const completeSession = async () => {
    try {
      await quizService.completeSession(sessionId);
      
      // Navigate to results page
      router.push(`/quiz/results/${sessionId}`);
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
          <Button onClick={() => router.push('/quiz')}>
            Back to Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/quiz')}
            className="mb-4 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz
          </Button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {session.category} Quiz
              </h1>
              <p className="text-slate-600 mt-1">
                Question {currentQuestionIndex + 1} of {session.totalQuestions}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentQuestionIndex + 1}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.title}</h2>
              <Badge className={session.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 
                               session.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                               'bg-red-100 text-red-800'}>
                {session.difficulty}
              </Badge>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed text-lg">{currentQuestion.question}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showResult || submitting}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedOption === option.id
                    ? showResult
                      ? option.id === correctOption
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showResult && option.id === correctOption ? 'border-green-500 bg-green-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg">{option.id.toUpperCase()}.</span>
                  <span className="text-lg">{option.text}</span>
                  {showResult && (
                    <span className="ml-auto">
                      {option.id === correctOption ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : selectedOption === option.id ? (
                        <XCircle className="w-6 h-6 text-red-500" />
                      ) : null}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-xl font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </h3>
                <Badge className="bg-green-100 text-green-800">
                  +{points} points
                </Badge>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Explanation:</h4>
                <p className="text-gray-700">{explanation}</p>
              </div>
              
              {interviewTip && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-semibold text-gray-800">Interview Tip:</h4>
                  </div>
                  <p className="text-gray-700">{interviewTip}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-end">
          {/* <Button 
            variant="outline" 
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button> */}
          
          <Button 
            onClick={nextQuestion}
            disabled={!showResult}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {currentQuestionIndex === session.totalQuestions - 1 ? (
              <>
                <Trophy className="w-4 h-4" />
                Finish Quiz
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 