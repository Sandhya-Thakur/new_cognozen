"use client";

import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

type QuizResponse = {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

type QuizResult = {
  quizId: number;
  attemptId: number;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  responses: QuizResponse[];
};

type Props = {
  chatId: number;
  pdfName: string;
  userId: string;
};

const QuizGenerator = ({ chatId, pdfName, userId }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const { toast } = useToast();

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/quizzes/generate-quiz", { chatId, pdfName });
      if (response.data.quizId) {
        await fetchQuiz(response.data.quizId);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuiz = async (quizId: number) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      console.log("Fetched quiz data:", response.data); // Debug log
      setQuiz(response.data);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuizCompleted(false);
      setQuizResult(null);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError("Failed to load the quiz. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load the quiz. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAnswerSelect = async (answer: string) => {
    if (!quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    try {
      const response = await axios.post("/api/quizzes/save-response", {
        quizId: quiz.id,
        userId,
        questionId: currentQuestion.id,
        userAnswer: answer,
        isLastQuestion
      });

      toast({
        title: "Answer Recorded",
        description: "Your answer has been successfully saved.",
        duration: 3000,
      });

      if (isLastQuestion) {
        await finishQuiz();
      } else {
        handleNextQuestion();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      setError("Failed to save your answer. Please try again.");

      toast({
        title: "Error",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

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

  const finishQuiz = async () => {
    if (!quiz) return;

    setQuizCompleted(true);
    try {
      const response = await axios.get(`/api/quizzes/${quiz.id}/results?userId=${userId}`);
      setQuizResult(response.data);
      toast({
        title: "Quiz Completed",
        description: "You've finished the quiz. Check your results below.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      setError("Failed to load quiz results. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load quiz results. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        {/* Debug information */}
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <p>PDF Name: {pdfName}</p>
          <p>Total Questions: {quiz?.questions.length}</p>
        </div>

        {!quiz && !quizCompleted && (
          <Button
            onClick={generateQuiz}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              "Generate New Quiz"
            )}
          </Button>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {quiz && !quizCompleted && (
          <div>
            <h3 className="font-bold mb-4">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </h3>
            <p className="text-lg mb-4">{quiz.questions[currentQuestionIndex]?.questionText}</p>
            <div className="space-y-2">
              {quiz.questions[currentQuestionIndex]?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={userAnswers[quiz.questions[currentQuestionIndex].id] === option ? "default" : "secondary"}
                  className="w-full justify-start text-left"
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {quizCompleted && quizResult && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Quiz Results</h3>
            <p>Total Score: {quizResult.totalScore}%</p>
            <p>Correct Answers: {quizResult.correctAnswers} out of {quizResult.totalQuestions}</p>
            {quizResult.duration && (
              <p>Time taken: {formatDuration(quizResult.duration)}</p>
            )}
            <div className="mt-6 space-y-4">
              {quizResult.responses.map((response, index) => (
                <div key={response.questionId} className="border p-4 rounded-lg">
                  <h4 className="font-semibold">Question {index + 1}: {response.questionText}</h4>
                  <p className={`mt-2 ${response.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your Answer: {response.userAnswer}
                  </p>
                  {!response.isCorrect && (
                    <p className="mt-1 text-green-600">Correct Answer: {response.correctAnswer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {quiz && !quizCompleted && (
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="default"
          >
            Previous
          </Button>
          <Button
            onClick={() => handleAnswerSelect(userAnswers[quiz.questions[currentQuestionIndex].id])}
            disabled={!userAnswers[quiz.questions[currentQuestionIndex].id]}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuizGenerator;