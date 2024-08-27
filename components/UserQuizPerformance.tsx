"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

interface QuizAttempt {
  id: number;
  quizId: number;
  userId: string;
  score: number;
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
}

interface QuizResponse {
  id: number;
  quizAttemptId: number;
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
}

interface Quiz {
  id: number;
  title: string;
  totalQuestions: number;
  attempts: (QuizAttempt & { responses: QuizResponse[] })[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const UserQuizPerformance: React.FC = () => {
  const [quizData, setQuizData] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('/api/quizzes/get-all-quizzes');
        setQuizData(response.data);
      } catch (err) {
        setError('Error fetching quiz data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading performance data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  // Calculate overall performance
  const totalAttempts = quizData.flatMap(quiz => quiz.attempts).length;
  const completedAttempts = quizData.flatMap(quiz => quiz.attempts.filter(attempt => attempt.completed)).length;
  const averageScore = quizData.flatMap(quiz => quiz.attempts.map(attempt => attempt.score))
    .reduce((sum, score) => sum + (score || 0), 0) / totalAttempts;

  // Prepare data for charts
  const quizPerformanceData = quizData.map(quiz => ({
    name: quiz.title,
    averageScore: quiz.attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / quiz.attempts.length,
    attempts: quiz.attempts.length
  }));

  const timePerformanceData = quizData.flatMap(quiz => 
    quiz.attempts.map(attempt => ({
      name: quiz.title,
      score: attempt.score,
      timeSpent: attempt.completedAt 
        ? (new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000 
        : 0
    }))
  );

  const correctVsIncorrectData = [
    { name: 'Correct', value: quizData.flatMap(quiz => quiz.attempts.flatMap(attempt => attempt.responses.filter(response => response.isCorrect))).length },
    { name: 'Incorrect', value: quizData.flatMap(quiz => quiz.attempts.flatMap(attempt => attempt.responses.filter(response => !response.isCorrect))).length }
  ];

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Your Quiz Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalAttempts}</p>
              <p className="text-sm text-gray-600">Total Attempts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{completedAttempts}</p>
              <p className="text-sm text-gray-600">Completed Quizzes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{averageScore.toFixed(2)}%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-[300px]">
              <h3 className="text-lg font-semibold mb-2">Performance by Quiz</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="averageScore" fill="#8884d8" name="Average Score" />
                  <Bar yAxisId="right" dataKey="attempts" fill="#82ca9d" name="Number of Attempts" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[300px]">
              <h3 className="text-lg font-semibold mb-2">Score vs Time Spent</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeSpent" label={{ value: 'Time Spent (minutes)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[300px]">
              <h3 className="text-lg font-semibold mb-2">Correct vs Incorrect Answers</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={correctVsIncorrectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {correctVsIncorrectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserQuizPerformance;