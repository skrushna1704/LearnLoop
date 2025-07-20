import React from 'react';
import { X, Trophy, Target, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface SessionCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAnswers: () => void;
  sessionData: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    category: string;
    difficulty: string;
  };
}

export default function SessionCompletionModal({ 
  isOpen, 
  onClose, 
  onReviewAnswers,
  sessionData 
}: SessionCompletionModalProps) {
  if (!isOpen) return null;

  const { score, totalQuestions, correctAnswers, category, difficulty } = sessionData;
  
  // Calculate performance metrics
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const isExcellent = score >= 90;
  const isGood = score >= 70;
  const isAverage = score >= 50;
  
  // Get performance message and color
  const getPerformanceInfo = () => {
    if (isExcellent) {
      return {
        message: "Excellent work! You're mastering this topic!",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    } else if (isGood) {
      return {
        message: "Great job! You're making solid progress!",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      };
    } else if (isAverage) {
      return {
        message: "Good effort! Keep practicing to improve!",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
      };
    } else {
      return {
        message: "Keep practicing! Every attempt makes you better!",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      };
    }
  };

  const performance = getPerformanceInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Session Complete!</h2>
              <p className="text-slate-600">{category} • {difficulty}</p>
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="p-6">
          <div className={`p-6 rounded-xl border-2 ${performance.bgColor} ${performance.borderColor} mb-6`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{score}%</div>
              <div className={`text-lg font-semibold ${performance.color} mb-2`}>
                {performance.message}
              </div>
              <div className="text-slate-600">
                {correctAnswers} out of {totalQuestions} questions correct
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 text-center">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{accuracy}%</div>
              <div className="text-sm text-slate-600">Accuracy</div>
            </Card>
            
            <Card className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{correctAnswers}</div>
              <div className="text-sm text-slate-600">Correct</div>
            </Card>
          </div>

          {/* Performance Badge */}
          <div className="text-center mb-6">
            {isExcellent && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
                <Star className="w-4 h-4" />
                <span className="font-semibold">Perfect Score!</span>
              </div>
            )}
            {isGood && !isExcellent && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full">
                <Star className="w-4 h-4" />
                <span className="font-semibold">Great Performance!</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
            >
              Continue Learning
            </Button>
            
            <Button
              onClick={onReviewAnswers}
              variant="outline"
              className="w-full py-3 rounded-xl font-semibold"
            >
              Review Answers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 