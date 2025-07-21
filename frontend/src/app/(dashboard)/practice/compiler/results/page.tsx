'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Share2,
  BarChart3,
  Zap,
  Target,
  Award,
  TrendingUp,
  Code,
  Brain,
  Medal,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/common';
import toast from 'react-hot-toast';

interface DSAQuestion {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  timeComplexity: string;
  spaceComplexity: string;
  completed: boolean;
  timeSpent: number;
  codeSubmitted: boolean;
}

interface DSAResult {
  sessionId: string;
  questions: DSAQuestion[];
  totalQuestions: number;
  completedQuestions: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  difficulty: string;
  category: string;
  completedAt: Date;
  performance: {
    accuracy: number;
    efficiency: number;
    speed: number;
    overall: number;
  };
  achievements: string[];
  nextRecommendations: string[];
}

export default function DSAResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [result, setResult] = useState<DSAResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadResults = useCallback(async () => {
    try {
      // In a real implementation, you'd fetch from API
      // For now, we'll simulate the data
      const mockResult: DSAResult = {
        sessionId: sessionId || 'mock-session',
        questions: [
          {
            _id: '1',
            title: 'Two Sum',
            description: 'Find two numbers that add up to target',
            difficulty: 'Easy',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            completed: true,
            timeSpent: 450,
            codeSubmitted: true
          },
          {
            _id: '2',
            title: 'Valid Parentheses',
            description: 'Check if parentheses are valid',
            difficulty: 'Easy',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            completed: true,
            timeSpent: 320,
            codeSubmitted: true
          },
          {
            _id: '3',
            title: 'Reverse Linked List',
            description: 'Reverse a singly linked list',
            difficulty: 'Medium',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            completed: false,
            timeSpent: 1800,
            codeSubmitted: false
          }
        ],
        totalQuestions: 3,
        completedQuestions: 2,
        totalTimeSpent: 2570,
        averageTimePerQuestion: 857,
        difficulty: 'Mixed',
        category: 'DSA',
        completedAt: new Date(),
        performance: {
          accuracy: 67,
          efficiency: 75,
          speed: 60,
          overall: 68
        },
        achievements: ['first_completion', 'speed_demon'],
        nextRecommendations: [
          'Practice more Medium difficulty problems',
          'Focus on time complexity optimization',
          'Try linked list problems'
        ]
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load results');
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      loadResults();
    } else {
      // If no sessionId, try to get from localStorage
      const sessionData = localStorage.getItem('dsa_session_data');
      if (sessionData) {
        setResult(JSON.parse(sessionData));
        localStorage.removeItem('dsa_session_data');
      }
    }
    setLoading(false);
  }, [sessionId, loadResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return 'Exceptional! You\'re a DSA master!';
    if (score >= 70) return 'Great job! Solid problem-solving skills!';
    if (score >= 50) return 'Good effort! Keep practicing!';
    return 'Keep studying! You\'ll improve with practice!';
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DSA Practice Results',
        text: `I completed ${result?.completedQuestions}/${result?.totalQuestions} DSA problems with ${result?.performance.overall}% performance!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`I completed ${result?.completedQuestions}/${result?.totalQuestions} DSA problems with ${result?.performance.overall}% performance!`);
      toast.success('Results copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Results Not Found</h2>
          <Button onClick={() => router.push('/practice')}>
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/practice')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            DSA Session Complete!
          </h1>
          <p className="text-xl text-slate-600">
            {getPerformanceMessage(result.performance.overall)}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <Card className="p-8 bg-gradient-to-br from-white to-green-50 border-2 border-green-100">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Overall Performance</h2>
                <div className={`text-6xl font-bold mb-4 ${getPerformanceColor(result.performance.overall)}`}>
                  {result.performance.overall}%
                </div>
                
                <div className="flex justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{result.completedQuestions}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{result.totalQuestions - result.completedQuestions}</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>Total Time: {formatTime(result.totalTimeSpent)}</span>
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

            {/* Performance Metrics */}
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Performance Metrics</h2>
                  <p className="text-gray-600">Detailed breakdown</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Accuracy</h3>
                  <div className={`text-3xl font-bold ${getPerformanceColor(result.performance.accuracy)}`}>
                    {result.performance.accuracy}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Problem-solving precision</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Efficiency</h3>
                  <div className={`text-3xl font-bold ${getPerformanceColor(result.performance.efficiency)}`}>
                    {result.performance.efficiency}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Code optimization</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Speed</h3>
                  <div className={`text-3xl font-bold ${getPerformanceColor(result.performance.speed)}`}>
                    {result.performance.speed}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Time management</p>
                </div>
              </div>
            </Card>

            {/* Question Breakdown */}
            <Card className="p-8 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600 to-gray-600 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Question Breakdown</h2>
                  <p className="text-gray-600">Individual problem analysis</p>
                </div>
              </div>

              <div className="space-y-4">
                {result.questions.map((question, index) => (
                  <div key={question._id} className="flex items-center justify-between p-4 bg-white rounded-xl border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="font-bold text-slate-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{question.title}</h4>
                        <p className="text-sm text-gray-600">{question.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Time</div>
                        <div className="font-mono text-sm">{formatTime(question.timeSpent)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Status</div>
                        <div className="flex items-center gap-1">
                          {question.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            question.completed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {question.completed ? 'Completed' : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="p-6 bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
              </div>
              
              <div className="space-y-3">
                {result.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Medal className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {achievement === 'first_completion' ? 'First Completion' : 
                       achievement === 'speed_demon' ? 'Speed Demon' : achievement}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
              </div>
              
              <div className="space-y-3">
                {result.nextRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-2 border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Session Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((result.completedQuestions / result.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Time/Question</span>
                  <span className="font-semibold text-blue-600">
                    {formatTime(result.averageTimePerQuestion)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold text-purple-600">
                    {result.difficulty}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            onClick={() => router.push('/practice')}
            className="flex-1 max-w-xs mx-auto"
          >
            Practice More
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/quiz')}
            className="flex-1 max-w-xs mx-auto"
          >
            Try Quiz Mode
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