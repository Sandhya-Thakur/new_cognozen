"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type QuizQuestion = {
  id: number;
  questionText: string;
  options: string[];
};

type Quiz = {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
};

type Props = {
  quizId: number;
};

const QuizDisplay = ({ quizId }: Props) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load the quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <p className="text-gray-600">{quiz.description}</p>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-4">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </h3>
        <p className="text-lg mb-4">{currentQuestion.questionText}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="default"
              className="w-full justify-start text-left"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handlePreviousQuestion} 
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentQuestionIndex === quiz.questions.length - 1}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizDisplay;