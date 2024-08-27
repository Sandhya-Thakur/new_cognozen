'use client';

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizResponse {
  id: number;
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizAttempt {
  id: number;
  userId: string;
  score: number | null;
  completed: boolean;
  responses: QuizResponse[];
}

interface Quiz {
  id: number;
  title: string;
  description: string | null;
  totalQuestions: number;
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
}

const QuizGroups: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<Quiz[], Error>({
    queryKey: ["quizGroups"],
    queryFn: async () => {
      const response = await axios.get<Quiz[]>("/api/quizzes/get-all-quizzes");
      return response.data;
    },
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<number, string[]>>({});

  if (isLoading) return <Skeleton className="w-full h-48" />;
  if (isError) return <div className="text-center text-blue-500">Error loading quiz groups</div>;

  const toggleGroup = (quizId: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [quizId]: prev[quizId] ? [] : ["group"],
    }));
  };

  const toggleQuestion = (quizId: number, questionId: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [quizId]: prev[quizId]?.includes(`question-${questionId}`)
        ? prev[quizId].filter((item) => item !== `question-${questionId}`)
        : [...(prev[quizId] || []), `question-${questionId}`],
    }));
  };

  const viewAll = () => {
    router.push("/allQuizzes");
  };

  return (
    <div className="bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-blue-800">Quizzes</h2>
        <button 
          onClick={viewAll} 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          View All
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((quiz) => (
          <Card key={quiz.id} className="overflow-hidden border border-blue-100">
            <CardHeader className="bg-blue-50 border-b border-blue-100 p-3 sm:p-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <span className="text-base sm:text-lg font-semibold text-blue-700 truncate">
                    {quiz.title.trim()}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-700">
                  {quiz.totalQuestions}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                value={expandedGroups[quiz.id] || []}
                onValueChange={(value) =>
                  setExpandedGroups((prev) => ({
                    ...prev,
                    [quiz.id]: value,
                  }))
                }
              >
                <AccordionItem value="group">
                  <AccordionTrigger
                    onClick={() => toggleGroup(quiz.id)}
                    className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-blue-50 text-sm sm:text-base"
                  >
                    <span className="font-medium text-blue-600">
                      View Questions
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y divide-blue-100">
                      {quiz.questions.map((question) => (
                        <li key={question.id} className="hover:bg-blue-50">
                          <Accordion
                            type="multiple"
                            value={expandedGroups[quiz.id] || []}
                            onValueChange={(value) =>
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [quiz.id]: value,
                              }))
                            }
                          >
                            <AccordionItem value={`question-${question.id}`}>
                              <AccordionTrigger
                                onClick={() => toggleQuestion(quiz.id, question.id)}
                                className="text-left p-2 sm:p-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-medium text-blue-700">
                                    {question.questionText}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="mt-2 text-xs sm:text-sm text-blue-600 pl-5 sm:pl-6 pr-2 pb-2">
                                  Correct Answer: {question.correctAnswer}
                                </p>
                                {quiz.attempts.map((attempt, index) => {
                                  const response = attempt.responses.find(r => r.questionId === question.id);
                                  return (
                                    <p key={index} className="mt-2 text-xs sm:text-sm text-blue-600 pl-5 sm:pl-6 pr-2 pb-2">
                                      Attempt {index + 1}: {response ? (response.isCorrect ? "Correct" : "Incorrect") : "Not answered"}
                                      {response && ` - ${response.userAnswer}`}
                                    </p>
                                  );
                                })}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizGroups;