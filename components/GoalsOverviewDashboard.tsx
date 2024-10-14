"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle } from 'lucide-react';

interface WellbeingGoal {
  id: number;
  content: string;
  completed: boolean;
  lastUpdated: string;
}

const GoalsOverviewDashboard: React.FC = () => {
  const [goals, setGoals] = useState<WellbeingGoal[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      // Replace this with your actual API call
      const response = await fetch("/api/wellbeing-goals");
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Failed to fetch goals. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  const GoalCard: React.FC<{ goal: WellbeingGoal }> = ({ goal }) => (
    <Card className="mb-4 overflow-hidden rounded-xl">
      <CardHeader className={`bg-green-500 text-white p-4 ${goal.completed ? 'bg-opacity-100' : 'bg-opacity-80'}`}>
        <CardTitle className="text-xl flex items-center">
          {goal.completed ? <CheckCircle className="mr-2" /> : <Circle className="mr-2" />}
          Goal #{goal.id}
        </CardTitle>
        <p className="text-sm mt-1">Last Updated: {goal.lastUpdated}</p>
      </CardHeader>
      <CardContent className="bg-white p-4">
        <p className="text-lg mb-4">{goal.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Status: {goal.completed ? "Completed" : "In Progress"}
          </span>
          <div className="w-3 h-3 rounded-full bg-green-200"></div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 bg-green-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-green-100 p-1 rounded-lg">
          <TabsTrigger 
            value="active" 
            className="px-4 py-2 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Active Goals
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="px-4 py-2 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Completed Goals
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="px-4 py-2 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            All Goals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsOverviewDashboard;