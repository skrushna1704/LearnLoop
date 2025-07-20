import React from 'react';
import { X, CheckCircle, XCircle, Clock, Target, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface QuestionReview {
  _id: string;
  title: string;
  question: string;
  difficulty: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent: number;
  correctAnswers: string[];
  interview_tip?: string;
  references?: string[];
  aiFeedback?: string;
  confidence?: number;
}

interface ReviewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    questions: QuestionReview[];
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    category: string;
    difficulty: string;
  };
}

export default function ReviewSessionModal({ 
  isOpen, 
  onClose, 
  sessionData 
}: ReviewSessionModalProps) {
  if (!isOpen) return null;

  const { questions, score, totalQuestions, correctAnswers, category, difficulty } = sessionData;
  
  // Calculate performance metrics
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const averageTime = Math.round(questions.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length);
  
  // Performance insights
  const getPerformanceInsights = () => {
    const insights = [];
    
    if (accuracy >= 90) {
      insights.push("Excellent accuracy! You're mastering this topic.");
    } else if (accuracy >= 70) {
      insights.push("Good performance! Focus on the missed questions.");
    } else {
      insights.push("Keep practicing! Review the explanations carefully.");
    }
    
    if (averageTime < 30) {
      insights.push("Quick responses! Consider taking more time for complex questions.");
    } else if (averageTime > 120) {
      insights.push("Thorough approach! Work on time management for interviews.");
    } else {
      insights.push("Good time management! Balanced speed and accuracy.");
    }
    
    return insights;
  };

  const insights = getPerformanceInsights();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Session Review</h2>
                <p className="text-slate-600">{category} • {difficulty} • {totalQuestions} Questions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          {/* Performance Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{score}%</div>
              <div className="text-sm text-slate-600">Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm text-slate-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{averageTime}s</div>
              <div className="text-sm text-slate-600">Avg Time</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Performance Insights */}
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Performance Insights</h3>
            </div>
            <ul className="space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {insight}
                </li>
              ))}
            </ul>
          </Card>

          {/* Questions Review */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={`${question._id}-${index}`} className="p-6 border-2 hover:shadow-lg transition-shadow">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      question.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{question.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 ${
                          question.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                          question.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {question.timeSpent}s
                  </div>
                </div>

                {/* Question */}
                <div className="mb-4">
                  <p className="text-slate-700 leading-relaxed">{question.question}</p>
                </div>

                {/* User Answer */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {question.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-semibold text-slate-800">Your Answer:</span>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${
                    question.isCorrect 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {question.userAnswer || 'No answer provided'}
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-slate-800">Correct Answer:</span>
                  </div>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                    <ul className="space-y-1">
                      {question.correctAnswers && question.correctAnswers.length > 0 ? (
                        question.correctAnswers.map((answer, idx) => (
                          <li key={idx} className="text-green-800 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {answer}
                          </li>
                        ))
                      ) : (
                        <li className="text-green-800 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          No correct answer provided
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* AI Feedback */}
                {question.aiFeedback && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <span className="font-semibold text-slate-800">AI Feedback:</span>
                      {question.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {Math.round(question.confidence * 100)}% confidence
                        </Badge>
                      )}
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800">{question.aiFeedback}</p>
                    </div>
                  </div>
                )}

                {/* Interview Tip */}
                {question.interview_tip && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">💡</span>
                      </div>
                      <span className="font-semibold text-slate-800">Interview Tip:</span>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800">{question.interview_tip}</p>
                    </div>
                  </div>
                )}

                {/* References */}
                {question.references && question.references.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">📚</span>
                      </div>
                      <span className="font-semibold text-slate-800">References:</span>
                    </div>
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
                      <ul className="space-y-1">
                        {question.references.map((ref, idx) => (
                          <li key={idx} className="text-purple-800 text-sm">
                            • {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
            >
              Close Review
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 py-3 rounded-xl font-semibold"
            >
              Practice Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 