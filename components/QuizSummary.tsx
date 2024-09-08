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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizSummary {
  id: number;
  chatId: number;
  title: string;
  totalQuestions: number;
  attemptId: number | null;
  completed: boolean;
  score: number | null;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  currentQuestionOrder: number;
  correctAnswers: number;
  totalAnswered: number;
}

const QuizSummary: React.FC = () => {
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<Record<number, string[]>>({});

  const { data, isLoading, isError, error } = useQuery<QuizSummary[], Error>({
    queryKey: ["quizSummary"],
    queryFn: async () => {
      const response = await axios.get<QuizSummary[]>("/api/quizzes/summary");
      return response.data;
    },
    select: (data) => {
      return [...data]
        .sort((a, b) => new Date(b.startedAt || "").getTime() - new Date(a.startedAt || "").getTime())
        .slice(0, 6);
    },
  });

  if (isLoading)
    return <div className="text-center p-4">Loading quiz summary...</div>;
  if (isError) {
    console.error("Error in component:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return (
          <div className="text-center text-[#0F52BA] p-4">
            Please log in to view your quiz summary.
          </div>
        );
      }
    }
    return (
      <div className="text-center text-[#0F52BA] p-4">
        Error loading quiz summary: {error.message}
      </div>
    );
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
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

  return (
    <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-[#0F52BA]">
          Quiz Summary
        </h2>
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
          data.map((quiz) => (
            <Card
              key={quiz.id}
              className="overflow-hidden border border-[#0F52BA] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="bg-[#E3F2FD] border-b border-[#0F52BA] p-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardCheck className="h-5 w-5 text-[#0F52BA]" />
                    <span className="font-semibold text-[#0F52BA] truncate">
                      {quiz.title.trim()}
                    </span>
                  </div>
                  <Badge
                    variant={quiz.completed ? "success" : "secondary"}
                    className={`text-xs px-2 py-1 ${quiz.completed ? "bg-green-100 text-green-800" : "bg-[#E3F2FD] text-[#0F52BA]"}`}
                  >
                    {quiz.completed ? "Completed" : "In Progress"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-[#0D47A1]">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Started: {formatDate(quiz.startedAt)}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[#0D47A1]">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-[#0D47A1]">
                        {quiz.progress}%
                      </span>
                    </div>
                    <div className="bg-[#E3F2FD] h-2 w-full rounded-full overflow-hidden">
                      <div
                        className="bg-[#0F52BA] h-full rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${quiz.progress}%` }}
                      />
                    </div>
                  </div>
                  {quiz.score !== null && (
                    <div className="flex items-center">
                      {quiz.score >= 70 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-sm font-medium text-[#0D47A1]">
                        Score: {quiz.score}%
                      </span>
                    </div>
                  )}
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
                    <AccordionItem value="group">
                      <AccordionTrigger
                        onClick={() => toggleGroup(quiz.id)}
                        className="py-2 text-sm text-[#0F52BA] hover:text-[#0D47A1]"
                      >
                        {expandedGroups[quiz.id]?.includes("group")
                          ? "Hide Details"
                          : "View Details"}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1">
                        <div className="space-y-2 text-sm text-[#0D47A1]">
                          <p>
                            Current Question: {quiz.currentQuestionOrder} /{" "}
                            {quiz.totalQuestions}
                          </p>
                          <p>
                            Correct Answers: {quiz.correctAnswers} /{" "}
                            {quiz.totalAnswered}
                          </p>
                          {quiz.completed && (
                            <p>Finished: {formatDate(quiz.completedAt)}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => navigateToQuiz(quiz.chatId)}
                          className="w-full mt-3 bg-[#0F52BA] text-white hover:bg-[#0D47A1]"
                          size="sm"
                        >
                          {quiz.completed ? "Review" : "Continue"}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-[#0D47A1] p-4">
            No quizzes found. Start a new quiz to see your summary here!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSummary;