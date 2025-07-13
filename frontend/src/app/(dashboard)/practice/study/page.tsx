'use client';

import React, { useState, useEffect, useCallback } from 'react';

import {
  BookOpen,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  Target,
  Zap,
  Star,
  XCircle,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Question } from '@/types/practice';
import { categories, difficulties } from '@/data/constants';



export default function StudyPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [selfMarks, setSelfMarks] = useState<(boolean | null)[]>([]);


  useEffect(() => {
    setSelfMarks(Array(filteredQuestions.length).fill(null));
  }, [filteredQuestions.length]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/practice/questions?category=${selectedCategory}&difficulty=${selectedDifficulty}&limit=100`);
      setQuestions(data);
      setFilteredQuestions(data);
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    if (selectedCategory && selectedDifficulty) {
      loadQuestions();
    }
  }, [selectedCategory, selectedDifficulty, loadQuestions]);

  const nextQuestion = () => {
    setUserInput('');
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const getCurrentQuestion = () => {
    return filteredQuestions[currentQuestionIndex];
  };

  const getDifficultyColor = (difficulty: string) => {
    const diff = difficulties.find(d => d.name === difficulty);
    return diff?.color || 'bg-gray-100 text-gray-800';
  };

  const handleSelfMark = (isCorrect: boolean) => {
    const updated = [...selfMarks];
    updated[currentQuestionIndex] = isCorrect;
    setSelfMarks(updated);
  };

  const correctCount = selfMarks.filter(Boolean).length;

  // UI starts here
  if (!selectedCategory || !selectedDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.push('/practice')}
              className="mb-6 hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice
            </Button>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Study Mode
              </h1>
              <p className="text-xl text-gray-600">Browse questions by category and difficulty to learn at your own pace</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Selection */}
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Choose a Category</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.name
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                      {selectedCategory === category.name && (
                        <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            {/* Difficulty Selection */}
            {selectedCategory && (
              <Card className="p-8 bg-gradient-to-br from-white to-purple-50 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Choose Difficulty</h2>
                </div>
                <div className="space-y-4">
                  {difficulties.map((difficulty) => (
                    <div
                      key={difficulty.name}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedDifficulty === difficulty.name
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedDifficulty(difficulty.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{difficulty.name}</h3>
                          <p className="text-gray-600">
                            {difficulty.name === 'Beginner' && 'Basic concepts and fundamentals'}
                            {difficulty.name === 'Intermediate' && 'Advanced concepts and best practices'}
                            {difficulty.name === 'Advanced' && 'Complex topics and expert-level knowledge'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${difficulty.color} shadow-lg`}>
                            {difficulty.name}
                          </Badge>
                          {selectedDifficulty === difficulty.name && (
                            <CheckCircle className="w-6 h-6 text-purple-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Questions Found</h2>
          <p className="text-gray-600 mb-4">
            No questions available for {selectedCategory} - {selectedDifficulty}
          </p>
          <Button onClick={() => {
            setSelectedCategory('');
            setSelectedDifficulty('');
          }}>
            Choose Different Category
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedCategory('');
              setSelectedDifficulty('');
            }}
            className="mb-6 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedCategory} Study
              </h1>
              <p className="text-gray-600 text-lg">{selectedDifficulty} Level</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} shadow-lg`}>
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </div>

          {/* Search
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white shadow-lg hover:shadow-xl"
            />
          </div> */}

          {/* Progress Bar for Self-Marking */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-emerald-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-800">
                    Correct: {correctCount} / {filteredQuestions.length}
                  </span>
                  <div className="text-sm text-gray-500">
                    {filteredQuestions.length > 0 ? Math.round((correctCount / filteredQuestions.length) * 100) : 0}% Accuracy
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor((correctCount / filteredQuestions.length) * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </Card>

          {/* Progress */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="text-gray-700 font-medium">
              {Math.round(((currentQuestionIndex + 1) / filteredQuestions.length) * 100)}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
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
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed text-lg">{currentQuestion.question}</p>
            </div>
          </div>

          {/* Active Recall: User Input */}
          {!showAnswer && (
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-3">Your Answer</label>
              <textarea
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-none h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white shadow-lg"
                disabled={showAnswer}
              />
            </div>
          )}

          {/* Answer Section */}
          {showAnswer ? (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm">?</span>
                  </div>
                  Your Answer:
                </h3>
                <p className="text-blue-700 whitespace-pre-line text-lg leading-relaxed">{userInput}</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
                <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  Correct Answer:
                </h3>
                {currentQuestion.answer && currentQuestion.answer.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {currentQuestion.answer.map((answer, index) => (
                      <li key={index} className="text-emerald-700 text-lg leading-relaxed">{answer}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-700 text-lg">No answer available for this question.</p>
                )}
              </Card>
              
              {currentQuestion.interview_tip && (
                <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-yellow-800">💡 Interview Tip:</h3>
                  </div>
                  <p className="text-yellow-700 text-lg leading-relaxed">{currentQuestion.interview_tip}</p>
                </Card>
              )}
              
              {currentQuestion.references && currentQuestion.references.length > 0 && (
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    📚 References:
                  </h3>
                  <ul className="space-y-3">
                    {currentQuestion.references.map((ref, index) => (
                      <li key={index}>
                        <a 
                          href={ref} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-2 text-lg hover:underline transition-colors duration-200"
                        >
                          {ref}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
              
              {/* Self-Marking Buttons */}
              {selfMarks[currentQuestionIndex] === null && (
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => handleSelfMark(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 text-lg px-8 py-3"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I was correct
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelfMark(false)}
                    className="border-2 border-red-400 text-red-700 hover:bg-red-50 hover:border-red-500 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg px-8 py-3"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    I was wrong
                  </Button>
                </div>
              )}
              
              {selfMarks[currentQuestionIndex] !== null && (
                <div className="mt-6">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-lg shadow-lg ${selfMarks[currentQuestionIndex] ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'}`}>
                    {selfMarks[currentQuestionIndex] ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    {selfMarks[currentQuestionIndex] ? 'Marked as Correct' : 'Marked as Incorrect'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <EyeOff className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-6 text-lg">Type your answer above, then click the button below to reveal the correct answer.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="shadow-lg hover:shadow-xl transform hover:scale-105 text-lg px-6 py-3"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <Button
              onClick={toggleAnswer}
              disabled={!userInput.trim() && !showAnswer}
              className="shadow-lg hover:shadow-xl transform hover:scale-105 text-lg px-8 py-3"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-5 h-5 mr-2" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  Show Answer
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={nextQuestion}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="shadow-lg hover:shadow-xl transform hover:scale-105 text-lg px-6 py-3"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Navigation Dots */}
        <div className="flex justify-center items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
          {filteredQuestions.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setShowAnswer(false);
              }}
              className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentQuestionIndex
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
          {filteredQuestions.length > 10 && (
            <span className="text-sm text-gray-500 ml-3 font-medium">
              +{filteredQuestions.length - 10} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 