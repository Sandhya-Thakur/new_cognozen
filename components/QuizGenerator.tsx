"use client";

import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Trophy, Target } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type QuizQuestion = {
  id: number;
  questionText: string;
  options: string[];
  difficulty?: string;
};

type Quiz = {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty?: string;
  totalQuestions: number;
};

type QuizResponse = {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  partialCredit?: number;
  analysis?: any;
  timeSpent?: number;
};

type QuizResult = {
  attemptId: number;
  finalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  responses: QuizResponse[];
  analysis?: {
    overallPerformance: {
      score: number;
      ranking: string;
      timeSpent: number;
    };
    recommendedActions: string[];
  };
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
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Generate quiz
      const generateResponse = await axios.post("/api/quizzes/generate-quiz", { 
        chatId, 
        pdfName,
        difficulty: "medium" 
      });
      
      if (generateResponse.data.quizId) {
        // Step 2: Start quiz attempt
        const attemptResponse = await axios.post("/api/quizzes/start-attempt", {
          quizId: generateResponse.data.quizId
        });
        
        setAttemptId(attemptResponse.data.attemptId);
        
        // Step 3: Fetch quiz questions
        await fetchQuiz(generateResponse.data.quizId);
        
        toast({
          title: "Quiz Generated",
          description: "Your quiz is ready! Good luck!",
          duration: 3000,
        });
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
      console.log("Fetched quiz data:", response.data);
      setQuiz(response.data);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuizCompleted(false);
      setQuizResult(null);
      setQuestionStartTime(Date.now()); // Start timing first question
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
    if (!quiz || !attemptId) return;

    setIsSubmittingAnswer(true);
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000); // Time in seconds
    
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    try {
      // Save response with time tracking
      const response = await axios.post("/api/quizzes/save-response", {
        attemptId,
        questionId: currentQuestion.id,
        userAnswer: answer,
        timeSpent
      });

      console.log("Response saved:", response.data);

      // Show feedback based on analysis
      const analysis = response.data.analysis;
      if (analysis) {
        let toastMessage = "";
        if (analysis.isCorrect) {
          toastMessage = "Correct! Well done!";
        } else if (analysis.partialCredit > 0) {
          toastMessage = `Partially correct! ${Math.round(analysis.partialCredit * 100)}% credit`;
        } else {
          toastMessage = "Incorrect, but keep trying!";
        }
        
        toast({
          title: "Answer Recorded",
          description: toastMessage,
          duration: 2000,
        });
      }

      // Check if this is the last question
      const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
      
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
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now()); // Start timing next question
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionStartTime(Date.now()); // Reset timer for previous question
    }
  };

  const finishQuiz = async () => {
    if (!quiz || !attemptId) return;

    setQuizCompleted(true);
    try {
      // Complete quiz and get detailed results
      const response = await axios.post("/api/quizzes/complete-quiz", {
        attemptId
      });
      
      setQuizResult(response.data);
      
      toast({
        title: "Quiz Completed!",
        description: `You scored ${response.data.finalScore}%! Check your detailed results below.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error completing quiz:", error);
      setError("Failed to complete quiz. Please try again.");
      toast({
        title: "Error",
        description: "Failed to complete quiz. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRankingBadge = (ranking: string) => {
    const badges = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-yellow-100 text-yellow-800",
      needs_improvement: "bg-red-100 text-red-800"
    };
    return badges[ranking as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Debug information - remove in production */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <div className="flex items-center gap-4">
            <span>📄 PDF: {pdfName}</span>
            {quiz && <span>❓ Questions: {quiz.questions.length}</span>}
            {attemptId && <span>🎯 Attempt ID: {attemptId}</span>}
          </div>
        </div>

        {!quiz && !quizCompleted && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
            <p className="text-gray-600 mb-6">Generate a personalized quiz based on your PDF content</p>
            <Button
              onClick={generateQuiz}
              disabled={isLoading}
              className="px-8 py-3 text-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-5 w-5" />
                  Generate New Quiz
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {quiz && !quizCompleted && (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Question {currentQuestionIndex + 1}
                </span>
                {quiz.questions[currentQuestionIndex]?.difficulty && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {quiz.questions[currentQuestionIndex].difficulty}
                  </span>
                )}
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                {quiz.questions[currentQuestionIndex]?.questionText}
              </p>
            </div>

            {/* Answer options */}
            <div className="space-y-3 mb-6">
              {quiz.questions[currentQuestionIndex]?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={userAnswers[quiz.questions[currentQuestionIndex].id] === option ? "default" : "outline"}
                  className="w-full justify-start text-left p-4 h-auto min-h-[3rem]"
                  onClick={() => {
                    const letter = String.fromCharCode(65 + index); // Gets "A", "B", "C", "D"
                    handleAnswerSelect(letter);
                  }}
                  disabled={isSubmittingAnswer}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {quizCompleted && quizResult && (
          <div className="space-y-6">
            {/* Results header */}
            <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-3xl font-bold mb-2">Quiz Completed!</h3>
              <div className="flex items-center justify-center gap-6 text-lg">
                <span className={`font-bold ${getScoreColor(quizResult.finalScore)}`}>
                  Score: {quizResult.finalScore}%
                </span>
                <span className="text-gray-600">
                  {quizResult.correctAnswers}/{quizResult.totalQuestions} Correct
                </span>
                {quizResult.analysis?.overallPerformance?.timeSpent && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    {formatDuration(quizResult.analysis.overallPerformance.timeSpent)}
                  </span>
                )}
              </div>
              {quizResult.analysis?.overallPerformance?.ranking && (
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRankingBadge(quizResult.analysis.overallPerformance.ranking)}`}>
                  {quizResult.analysis.overallPerformance.ranking.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>

            {/* Recommendations */}
            {quizResult.analysis?.recommendedActions && quizResult.analysis.recommendedActions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">💡 Recommendations</h4>
                <ul className="space-y-1">
                  {quizResult.analysis.recommendedActions.map((action, index) => (
                    <li key={index} className="text-blue-700 text-sm">• {action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed results */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Detailed Results</h4>
              {quizResult.responses.map((response, index) => (
                <div key={response.questionId} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      Question {index + 1}
                      {response.timeSpent && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {formatDuration(response.timeSpent)}
                        </span>
                      )}
                    </h5>
                    <div className="flex items-center gap-2">
                      {response.isCorrect ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          ✓ Correct
                        </span>
                      ) : response.partialCredit && response.partialCredit > 0 ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                          ⚡ {Math.round(response.partialCredit * 100)}% Credit
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          ✗ Incorrect
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{response.questionText}</p>
                  
                  <div className="space-y-2">
                    <p className={`${response.isCorrect ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      Your Answer: {response.userAnswer}
                    </p>
                    {!response.isCorrect && (
                      <p className="text-green-600 font-medium">
                        Correct Answer: {response.correctAnswer}
                      </p>
                    )}
                    {response.analysis?.reasoning && (
                      <p className="text-gray-600 text-sm italic">
                        {response.analysis.reasoning}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="flex-1"
              >
                Take Another Quiz
              </Button>
              <Button 
                onClick={() => setQuizCompleted(false)} 
                className="flex-1"
              >
                Review Questions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {quiz && !quizCompleted && (
        <CardFooter className="flex justify-between bg-gray-50">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            ← Previous
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <Button
            onClick={() => {
              const currentAnswer = userAnswers[quiz.questions[currentQuestionIndex].id];
              if (currentAnswer) {
                handleAnswerSelect(currentAnswer);
              }
            }}
            disabled={!userAnswers[quiz.questions[currentQuestionIndex].id] || isSubmittingAnswer}
          >
            {isSubmittingAnswer ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next →"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuizGenerator;