"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ClipboardCheck,
  ChevronRight,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizAttempt {
  id: number;
  quizId: number;
  userId: string;
  score: number | null;
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
  totalTimeSpent: number | null;
  correctAnswers: number;
  wrongAnswers: number;
  currentQuestionOrder: number;
}

interface Quiz {
  id: number;
  chatId: number;
  title: string;
  description: string | null;
  totalQuestions: number;
  difficulty: string | null;
  category: string | null;
  createdAt: string;
}

interface QuizSummaryData {
  quiz: Quiz;
  latestAttempt: QuizAttempt | null;
  bestScore: number | null;
  totalAttempts: number;
  averageScore: number | null;
  progress: number;
  masteryLevel: string | null;
}

const QuizSummary: React.FC = () => {
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<Record<number, string[]>>({});

  const { data, isLoading, isError, error } = useQuery<QuizSummaryData[], Error>({
    queryKey: ["quizSummary"],
    queryFn: async () => {
      const response = await axios.get<QuizSummaryData[]>("/api/quizzes/user-summary");
      return response.data;
    },
    select: (data) => {
      return [...data]
        .sort((a, b) => {
          const aDate = a.latestAttempt?.startedAt || a.quiz.createdAt;
          const bDate = b.latestAttempt?.startedAt || b.quiz.createdAt;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .slice(0, 6);
    },
  });

  if (isLoading) {
    return (
      <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F52BA]"></div>
          <span className="ml-3 text-[#0F52BA]">Loading quiz summary...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error in component:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return (
          <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
            <div className="text-center text-[#0F52BA] p-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please log in to view your quiz summary.</p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
        <div className="text-center text-red-600 p-8">
          <p>Error loading quiz summary: {error.message}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const navigateToQuiz = (chatId: number): void => {
    router.push(`/quizzes/${chatId}`);
  };

  const toggleGroup = (quizId: number): void => {
    setExpandedGroups((prev) => ({
      ...prev,
      [quizId]: prev[quizId]?.includes("group") ? [] : ["group"],
    }));
  };

  const viewAll = (): void => {
    router.push("/allQuizzes");
  };

  const getScoreColor = (score: number | null): string => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMasteryBadge = (level: string | null): { color: string; label: string } => {
    switch (level) {
      case "expert":
        return { color: "bg-purple-100 text-purple-800", label: "Expert" };
      case "advanced":
        return { color: "bg-blue-100 text-blue-800", label: "Advanced" };
      case "intermediate":
        return { color: "bg-green-100 text-green-800", label: "Intermediate" };
      case "beginner":
        return { color: "bg-yellow-100 text-yellow-800", label: "Beginner" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: "New" };
    }
  };

  return (
    <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0F52BA] flex items-center gap-2">
            <Target className="h-6 w-6" />
            Quiz Performance
          </h2>
          <p className="text-[#0D47A1] text-sm mt-1">
            Track your learning progress and achievements
          </p>
        </div>
        <button
          onClick={viewAll}
          className="flex items-center text-[#0F52BA] hover:text-[#0D47A1] transition-colors duration-200 font-semibold"
        >
          View All
          <ChevronRight className="ml-1 w-5 h-5" />
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data && data.length > 0 ? (
          data.map((quizData) => {
            const { quiz, latestAttempt, bestScore, totalAttempts, averageScore, masteryLevel } = quizData;
            const masteryBadge = getMasteryBadge(masteryLevel);
            
            return (
              <Card
                key={quiz.id}
                className="overflow-hidden border border-[#0F52BA] bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-[#F3E5F5] border-b border-[#0F52BA] p-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <ClipboardCheck className="h-5 w-5 text-[#0F52BA] flex-shrink-0" />
                      <span className="font-semibold text-[#0F52BA] truncate">
                        {quiz.title.trim()}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {latestAttempt?.completed ? (
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                          Completed
                        </Badge>
                      ) : latestAttempt ? (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                          In Progress
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                          New
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  {quiz.difficulty && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[#0D47A1]">Difficulty:</span>
                      <Badge variant="outline" className="text-xs">
                        {quiz.difficulty}
                      </Badge>
                      <Badge className={`text-xs ${masteryBadge.color}`}>
                        {masteryBadge.label}
                      </Badge>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Performance metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs font-medium text-[#0D47A1]">Best Score</span>
                        </div>
                        <span className={`text-lg font-bold ${getScoreColor(bestScore)}`}>
                          {bestScore !== null ? `${bestScore}%` : "N/A"}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium text-[#0D47A1]">Attempts</span>
                        </div>
                        <span className="text-lg font-bold text-[#0F52BA]">
                          {totalAttempts}
                        </span>
                      </div>
                    </div>

                    {/* Latest attempt info */}
                    {latestAttempt && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-[#0D47A1]">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Last attempt: {formatDate(latestAttempt.startedAt)}</span>
                        </div>
                        
                        {latestAttempt.completed && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#0D47A1]">Time taken:</span>
                            <span className="text-sm font-medium">
                              {formatDuration(latestAttempt.totalTimeSpent)}
                            </span>
                          </div>
                        )}

                        {/* Progress bar for incomplete quizzes */}
                        {!latestAttempt.completed && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-[#0D47A1]">Progress</span>
                              <span className="text-sm font-medium text-[#0D47A1]">
                                {Math.round((latestAttempt.currentQuestionOrder / quiz.totalQuestions) * 100)}%
                              </span>
                            </div>
                            <div className="bg-[#E3F2FD] h-2 w-full rounded-full overflow-hidden">
                              <div
                                className="bg-[#0F52BA] h-full rounded-full transition-all duration-300 ease-in-out"
                                style={{ 
                                  width: `${(latestAttempt.currentQuestionOrder / quiz.totalQuestions) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Average score for multiple attempts */}
                    {totalAttempts > 1 && averageScore !== null && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#0D47A1]">Average Score</span>
                          <span className={`font-bold ${getScoreColor(Math.round(averageScore))}`}>
                            {Math.round(averageScore)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Expandable details */}
                    <Accordion
                      type="single"
                      collapsible
                      value={expandedGroups[quiz.id]?.[0]}
                      onValueChange={(value) =>
                        setExpandedGroups((prev) => ({
                          ...prev,
                          [quiz.id]: value ? [value] : [],
                        }))
                      }
                    >
                      <AccordionItem value="group" className="border-none">
                        <AccordionTrigger
                          onClick={() => toggleGroup(quiz.id)}
                          className="py-2 text-sm text-[#0F52BA] hover:text-[#0D47A1] hover:no-underline"
                        >
                          {expandedGroups[quiz.id]?.includes("group")
                            ? "Hide Details"
                            : "View Details"}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 px-1">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-[#0D47A1]">Questions:</span>
                                <p className="text-gray-600">{quiz.totalQuestions}</p>
                              </div>
                              {quiz.category && (
                                <div>
                                  <span className="font-medium text-[#0D47A1]">Category:</span>
                                  <p className="text-gray-600 truncate">{quiz.category}</p>
                                </div>
                              )}
                            </div>
                            
                            {latestAttempt?.completed && (
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-[#0D47A1]">Correct:</span>
                                  <p className="text-green-600">{latestAttempt.correctAnswers}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-[#0D47A1]">Wrong:</span>
                                  <p className="text-red-600">{latestAttempt.wrongAnswers}</p>
                                </div>
                              </div>
                            )}

                            <Button
                              onClick={() => navigateToQuiz(quiz.chatId)}
                              className="w-full mt-3 bg-[#0F52BA] text-white hover:bg-[#0D47A1]"
                              size="sm"
                            >
                              {latestAttempt?.completed ? (
                                <>
                                  <Trophy className="mr-2 h-4 w-4" />
                                  Review Results
                                </>
                              ) : latestAttempt ? (
                                <>
                                  <Target className="mr-2 h-4 w-4" />
                                  Continue Quiz
                                </>
                              ) : (
                                <>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Start Quiz
                                </>
                              )}
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center p-8">
            <BookOpen className="h-16 w-16 mx-auto text-[#0F52BA] opacity-50 mb-4" />
            <h3 className="text-lg font-semibold text-[#0D47A1] mb-2">No Quizzes Yet</h3>
            <p className="text-[#0D47A1] mb-4">
              Upload a PDF and generate your first quiz to get started!
            </p>
            <Button 
              onClick={() => router.push("/cognohub")}
              className="bg-[#0F52BA] text-white hover:bg-[#0D47A1]"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSummary;