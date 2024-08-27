"use client"
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClipboardCheck, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizSummary {
  id: number;
  chatId: number;
  title: string;
  totalQuestions: number;
  attemptId: number | null;
  completed: boolean | null;
  score: number | null;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
}

const QuizSummary: React.FC = () => {
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<Record<number, string[]>>({});

  const { data, isLoading, isError, error } = useQuery<QuizSummary[], Error>({
    queryKey: ["quizSummary"],
    queryFn: async () => {
      const response = await axios.get<QuizSummary[]>('/api/quizzes/summary');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center">Loading quiz summary...</div>;
  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return <div className="text-center text-red-500">Please log in to view your quiz summary.</div>;
      }
      if (error.response?.status === 404) {
        return <div className="text-center text-gray-500">No quizzes found. Start a new quiz to see your summary here!</div>;
      }
    }
    return <div className="text-center text-red-500">Error loading quiz summary</div>;
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
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Quiz Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data && data.length > 0 ? (
          data.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col h-full border border-blue-100">
              <CardHeader className="bg-blue-50 border-b border-blue-100 p-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <span className="text-base font-semibold text-blue-700 truncate">
                      {quiz.title.trim()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {quiz.totalQuestions}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between p-3">
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-600">Started: {formatDate(quiz.startedAt)}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">Progress</span>
                      <span className="text-xs font-medium text-gray-600">{quiz.progress}%</span>
                    </div>
                    <Progress value={quiz.progress} className="h-2" />
                  </div>
                  {quiz.score !== null && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-600">Score: {quiz.score}%</span>
                    </div>
                  )}
                </div>
                <Accordion
                  type="single"
                  collapsible
                  value={expandedGroups[quiz.id]?.[0]}
                  onValueChange={(value) => setExpandedGroups((prev) => ({ ...prev, [quiz.id]: value ? [value] : [] }))}
                >
                  <AccordionItem value="group">
                    <AccordionTrigger
                      onClick={() => toggleGroup(quiz.id)}
                      className="py-1 hover:bg-blue-50 text-sm"
                    >
                      <span className="font-medium text-blue-600">
                        {expandedGroups[quiz.id]?.includes("group") ? "Hide Details" : "View Details"}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-gray-600 mb-2">
                        Status: {quiz.completed ? "Completed" : "In Progress"}
                      </p>
                      {quiz.completed && (
                        <p className="text-xs text-gray-600 mb-2">
                          Finished: {formatDate(quiz.completedAt)}
                        </p>
                      )}
                      <Button 
                        onClick={() => navigateToQuiz(quiz.chatId)} 
                        className="w-full mt-2"
                        variant="secondary"
                        size="sm"
                      >
                        {quiz.completed ? "Review" : "Continue"}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No quizzes found. Start a new quiz to see your summary here!</div>
        )}
      </div>
    </div>
  );
};

export default QuizSummary;