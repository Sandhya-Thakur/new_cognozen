"use client"

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClipboardCheck, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";
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
      try {
        const response = await axios.get<QuizSummary[]>('/api/quizzes/summary');
        console.log('API Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
  });

  if (isLoading) return <div className="text-center p-4">Loading quiz summary...</div>;
  if (isError) {
    console.error('Error in component:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return <div className="text-center text-red-500 p-4">Please log in to view your quiz summary.</div>;
      }
    }
    return <div className="text-center text-red-500 p-4">Error loading quiz summary: {error.message}</div>;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const navigateToQuiz = (chatId: number) => {
    router.push(`/quizzes/${chatId}`);
  };

  const toggleGroup = (quizId: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [quizId]: prev[quizId]?.includes("group") ? [] : ["group"],
    }));
  };

  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map((quiz) => (
          <Card key={quiz.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 p-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-gray-800 truncate">
                    {quiz.title.trim()}
                  </span>
                </div>
                <Badge 
                  variant={quiz.completed ? "success" : "secondary"}
                  className="text-xs px-2 py-1"
                >
                  {quiz.completed ? "Completed" : "In Progress"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Started: {formatDate(quiz.startedAt)}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{quiz.progress}%</span>
                  </div>
                  <Progress value={quiz.progress} className="h-2" />
                </div>
                {quiz.score !== null && (
                  <div className="flex items-center">
                    {quiz.score >= 70 ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-700">Score: {quiz.score}%</span>
                  </div>
                )}
                <Accordion
                  type="single"
                  collapsible
                  value={expandedGroups[quiz.id]?.[0]}
                  onValueChange={(value) => setExpandedGroups((prev) => ({ ...prev, [quiz.id]: value ? [value] : [] }))}
                >
                  <AccordionItem value="group">
                    <AccordionTrigger
                      onClick={() => toggleGroup(quiz.id)}
                      className="py-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {expandedGroups[quiz.id]?.includes("group") ? "Hide Details" : "View Details"}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 px-1">
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Current Question: {quiz.currentQuestionOrder} / {quiz.totalQuestions}</p>
                        <p>Correct Answers: {quiz.correctAnswers} / {quiz.totalAnswered}</p>
                        {quiz.completed && (
                          <p>Finished: {formatDate(quiz.completedAt)}</p>
                        )}
                      </div>
                      <Button 
                        onClick={() => navigateToQuiz(quiz.chatId)} 
                        className="w-full mt-3"
                        variant="secondary"
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
        <div className="text-center text-gray-500 p-4">No quizzes found. Start a new quiz to see your summary here!</div>
      )}
    </div>
  );
};

export default QuizSummary;