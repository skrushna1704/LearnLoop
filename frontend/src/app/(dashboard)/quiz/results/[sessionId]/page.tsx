'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Share2,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import { LoadingSpinner } from '@/components/common';
import toast from 'react-hot-toast';
import { quizService } from '@/data/services/quizService';

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  totalPoints: number;
  timeSpent: number;
}

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadResults = useCallback(async () => {
    try {
      const resultData = await quizService.completeSession(sessionId);
      setResult(resultData);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! You\'re a quiz master!';
    if (score >= 70) return 'Great job! You have solid knowledge!';
    if (score >= 50) return 'Good effort! Keep practicing!';
    return 'Keep studying! You\'ll improve with practice!';
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: `I scored ${result?.score}% on my quiz!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`I scored ${result?.score}% on my quiz!`);
      toast.success('Results copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Results Not Found</h2>
          <Button onClick={() => router.push('/quiz')}>
            Back to Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/quiz')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Quiz Complete!
          </h1>
          <p className="text-xl text-slate-600">
            {getScoreMessage(result.score)}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Score Card */}
          <Card className="p-8 bg-gradient-to-br from-white to-green-50 border-2 border-green-100">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Your Score</h2>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
              
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{result.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{result.totalQuestions - result.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                <Clock className="w-4 h-4" />
                <span>Time: {formatTime(result.timeSpent)}</span>
              </div>

              <Button
                onClick={shareResults}
                variant="outline"
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Session Stats</h2>
                <p className="text-gray-600">Detailed breakdown</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Correct Answers</span>
                </div>
                <span className="font-semibold text-green-600">{result.correctAnswers}/{result.totalQuestions}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Incorrect Answers</span>
                </div>
                <span className="font-semibold text-red-600">{result.totalQuestions - result.correctAnswers}/{result.totalQuestions}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-700">Total Points</span>
                </div>
                <span className="font-semibold text-yellow-600">{result.totalPoints}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Average Time</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {formatTime(Math.round(result.timeSpent / result.totalQuestions))}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            onClick={() => router.push('/quiz')}
            className="flex-1 max-w-xs mx-auto"
          >
            Take Another Quiz
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/practice')}
            className="flex-1 max-w-xs mx-auto"
          >
            Practice Mode
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex-1 max-w-xs mx-auto"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
} 