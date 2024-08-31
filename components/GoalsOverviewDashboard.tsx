"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface GoalData {
  name: string;
  progress: number;
  target: number;
}

const GoalsOverviewDashboard: React.FC = () => {
  // Example data - replace this with actual data from your backend
  const [liveData] = useState<GoalData[]>([
    { name: "Read 30 mins", progress: 15, target: 30 },
    { name: "Exercise", progress: 25, target: 60 },
    { name: "Learn new skill", progress: 45, target: 60 },
    { name: "Meditate", progress: 8, target: 10 },
  ]);
  const [todayData] = useState<GoalData[]>([
    { name: "Read 30 mins", progress: 30, target: 30 },
    { name: "Exercise", progress: 45, target: 60 },
    { name: "Learn new skill", progress: 30, target: 60 },
    { name: "Meditate", progress: 10, target: 10 },
  ]);
  const [tenDaysData] = useState<GoalData[]>([
    { name: "Read 5 books", progress: 3, target: 5 },
    { name: "Exercise 10 times", progress: 7, target: 10 },
    { name: "Complete online course", progress: 60, target: 100 },
    { name: "Meditate 50 mins", progress: 35, target: 50 },
  ]);
  const [monthData] = useState<GoalData[]>([
    { name: "Read 10 books", progress: 6, target: 10 },
    { name: "Exercise 20 times", progress: 15, target: 20 },
    { name: "Learn new language", progress: 40, target: 100 },
    { name: "Meditate 200 mins", progress: 150, target: 200 },
  ]);

  const renderGoalChart = (data: GoalData[], title: string) => (
    <Card className="border-[#C0C0C0] mb-6">
      <CardHeader className="bg-[#0F52BA] text-white">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-[#87CEEB]">Goal progress overview</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" name="Progress" stackId="a">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#0F52BA" />
              ))}
            </Bar>
            <Bar dataKey="target" name="Target" stackId="a">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#87CEEB" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Goals Overview</h1>

      <Tabs defaultValue="live" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Goals</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Today's Goals</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">10-Day Goals</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Monthly Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          {renderGoalChart(liveData, "Live Goal Progress")}
        </TabsContent>

        <TabsContent value="today">
          {renderGoalChart(todayData, "Today's Goal Progress")}
        </TabsContent>

        <TabsContent value="tenDays">
          {renderGoalChart(tenDaysData, "10-Day Goal Progress")}
        </TabsContent>

        <TabsContent value="month">
          {renderGoalChart(monthData, "Monthly Goal Progress")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsOverviewDashboard;