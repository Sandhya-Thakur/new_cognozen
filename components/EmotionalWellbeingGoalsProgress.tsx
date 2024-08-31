"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface EmotionalWellbeingGoal {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const EmotionalWellbeingGoalsProgress: React.FC = () => {
  const [activeGoals, setActiveGoals] = useState<EmotionalWellbeingGoal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<EmotionalWellbeingGoal[]>([]);
  const [allGoals, setAllGoals] = useState<EmotionalWellbeingGoal[]>([]);

  useEffect(() => {
    // Fetch emotional wellbeing goals from your API
    // This is a placeholder. Replace with actual API calls.
    const fetchGoals = async () => {
      // const response = await fetch('/api/emotional-wellbeing-goals');
      // const data = await response.json();
      // setActiveGoals(data.active);
      // setCompletedGoals(data.completed);
      // setAllGoals(data.all);

      // Placeholder data
      const goals = [
        { id: 1, content: "Practice mindfulness meditation for 10 minutes daily", completed: false, createdAt: "2024-08-01T10:00:00Z", updatedAt: "2024-08-29T09:00:00Z" },
        { id: 2, content: "Write down three things I'm grateful for each day", completed: true, createdAt: "2024-08-05T11:30:00Z", updatedAt: "2024-08-28T22:00:00Z" },
        { id: 3, content: "Engage in a meaningful conversation with a friend weekly", completed: false, createdAt: "2024-08-10T14:15:00Z", updatedAt: "2024-08-29T08:30:00Z" },
        { id: 4, content: "Practice deep breathing exercises when feeling stressed", completed: false, createdAt: "2024-08-15T16:45:00Z", updatedAt: "2024-08-29T10:15:00Z" },
      ];

      setActiveGoals(goals.filter(goal => !goal.completed));
      setCompletedGoals(goals.filter(goal => goal.completed));
      setAllGoals(goals);
    };

    fetchGoals();
  }, []);

  const renderGoals = (goals: EmotionalWellbeingGoal[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="border-[#C0C0C0]">
          <CardHeader className="bg-[#0F52BA] text-white">
            <CardTitle className="text-lg">Goal #{goal.id}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-4">
            <p className="mb-2">{goal.content}</p>
            <Progress value={goal.completed ? 100 : 50} className="w-full mb-2" />
            <p className="text-sm text-gray-600">
              Status: {goal.completed ? "Completed" : "In Progress"}
            </p>
            <p className="text-sm text-gray-600">
              Last Updated: {new Date(goal.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Emotional Wellbeing Goals Progress</h1>

      <Tabs defaultValue="active" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="active" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Active Goals</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Completed Goals</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">All Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderGoals(activeGoals)}
        </TabsContent>

        <TabsContent value="completed">
          {renderGoals(completedGoals)}
        </TabsContent>

        <TabsContent value="all">
          {renderGoals(allGoals)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionalWellbeingGoalsProgress;