"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
}

const GoalsOverviewDashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Fetch goals data here
    // For example:
    // fetchGoals().then(setGoals);
    
    // Placeholder data
    setGoals([
      { id: '1', title: 'Read 20 books', description: 'Expand knowledge through reading', progress: 45, category: 'Personal Development' },
      { id: '2', title: 'Exercise 3 times a week', description: 'Improve physical health', progress: 67, category: 'Health' },
      { id: '3', title: 'Learn a new language', description: 'Enhance communication skills', progress: 30, category: 'Education' },
      { id: '4', title: 'Save $5000', description: 'Build financial security', progress: 80, category: 'Finance' },
    ]);
  }, []);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Personal Development': return 'bg-blue-500';
      case 'Health': return 'bg-green-500';
      case 'Education': return 'bg-purple-500';
      case 'Finance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Goals Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="border-gray-200">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="text-xl">{goal.title}</CardTitle>
              <CardDescription className="text-blue-200">
                {goal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="w-full" />
              <div className="mt-4">
                <Badge className={`${getCategoryColor(goal.category)} text-white`}>
                  {goal.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200 mt-8">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl">Goal Insights</CardTitle>
          <CardDescription className="text-blue-200">
            Reflecting on your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <p>
            You are making great progress on your goals! Here are some insights:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>You are excelling in your financial goals.</li>
            <li>Your commitment to health is showing promising results.</li>
            <li>Consider allocating more time to your educational goals.</li>
            <li>Your personal development journey is on the right track.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsOverviewDashboard;