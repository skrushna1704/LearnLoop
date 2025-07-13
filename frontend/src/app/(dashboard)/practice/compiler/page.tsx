"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Play, Terminal, Code, Clock, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import Editor from "@monaco-editor/react";

export default function DSACompilerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const count = parseInt(searchParams.get("count") || "5", 10);
  const difficulty = searchParams.get("difficulty") || "Beginner";

  interface Question {
    _id?: string;
    title: string;
    description: string;
    example: string;
    starterCode: string;
    difficulty: string;
    timeComplexity: string;
    spaceComplexity: string;
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
  const [showNext, setShowNext] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Fetch questions on mount
  useEffect(() => {
    async function fetchSession() {
      setLoading(true);
      try {
        const { data } = await apiClient.post("/practice/session", {
          category: "DSA",
          difficulty,
          questionCount: count,
        });
        const mappedQuestions = data.questions.map(
          (q: Record<string, unknown>) => ({
            ...q,
            description: typeof q.question === "string" ? q.question : "",
            starterCode:
              typeof q.starterCode === "string"
                ? q.starterCode
                : "// Write your code here...",
            example: typeof q.example === "string" ? q.example : "",
            timeComplexity:
              typeof q.timeComplexity === "string" ? q.timeComplexity : "",
            spaceComplexity:
              typeof q.spaceComplexity === "string" ? q.spaceComplexity : "",
          })
        );
        setQuestions(mappedQuestions);
        setCode(mappedQuestions[0]?.starterCode || "");
        setCurrentIndex(0);
        setTimer(30 * 60);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [count, difficulty]);

  // Reset timer and code on question change
  useEffect(() => {
    if (questions.length > 0) {
      setCode(questions[currentIndex]?.starterCode || "");
      setTimer(30 * 60);
      setShowNext(false);
    }
  }, [currentIndex, questions]);

  const formatTimer = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRun = async () => {
    console.log("Run Code clicked");
    setIsRunning(true);
    setOutput("Running your code...");
    try {
      const { data } = await apiClient.post("/practice/compile", {
        code,
        questionId: currentQuestion._id,
      });
      if (data.error) {
        setOutput(`❌ Error: ${data.error}`);
      } else {
        setOutput(data.output);
      }
    } catch (err: unknown) {
      console.log(err);
      setOutput("❌ Failed to run code.");
    } finally {
      setIsRunning(false);
      setShowNext(true);
      if (intervalId) clearInterval(intervalId);
    }
  };

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      router.push("/practice"); // Or show results page
    }
  }, [currentIndex, questions.length, router]);

  // Timer logic
  useEffect(() => {
    if (loading || showNext) return;
    if (timer <= 0) {
      handleNext();
      return;
    }
    const id = setInterval(() => setTimer((t: number) => t - 1), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [timer, loading, showNext, handleNext]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading questions...</div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">
          No DSA questions found.
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Progress Bar & Question Number */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/practice")}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">
                Back to Practice
              </span>
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold">
              Question {currentIndex + 1} of {questions.length}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timer)}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Main Content (reuse your existing UI, but use currentQuestion) */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentQuestion.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {currentQuestion.description}
              </p>
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Example
                </h3>
                <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {currentQuestion.example}
                </pre>
              </div>
            </div>
            {/* Complexity Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Complexity Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Complexity:</span>
                  <span className="font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                    {currentQuestion.timeComplexity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Space Complexity:</span>
                  <span className="font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded-lg">
                    {currentQuestion.spaceComplexity}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Code Editor & Output */}
          <div className="space-y-6">
            {/* Code Editor */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    JavaScript
                  </span>
                </div>
                <div className="text-gray-400 text-sm">main.js</div>
              </div>
              <div
                className="bg-slate-900 text-white p-0"
                style={{ height: "400px" }}
              >
                <Editor
                  height="400px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    fontFamily: "Fira Code, Consolas, monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>
            {/* Run Button */}
            <div className="flex gap-4">
              <button
                onClick={handleRun}
                disabled={isRunning || showNext}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300
                  ${
                    isRunning || showNext
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Code
                  </>
                )}
              </button>
              {showNext && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {currentIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish"}
                </button>
              )}
            </div>
            {/* Output Panel */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Output
                </h3>
              </div>
              <div className="p-6 min-h-[120px] max-h-[200px] overflow-y-auto">
                <div className="font-mono text-sm text-green-400 whitespace-pre-wrap leading-relaxed">
                  {output || (
                    <span className="text-gray-500">
                      Click &quot;Run Code&quot; to see the output...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
