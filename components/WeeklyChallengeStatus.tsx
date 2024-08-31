"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChallengeData {
  challenge: string;
  progress: number;
  target: number;
}

const WeeklyChallengeStatus: React.FC = () => {
  // Example data - replace with actual data fetching logic
  const [currentWeekData] = useState<ChallengeData[]>([
    { challenge: "10k Steps", progress: 8000, target: 10000 },
    { challenge: "Meditate 30 mins", progress: 20, target: 30 },
    { challenge: "Read 3 books", progress: 2, target: 3 },
    { challenge: "Drink 2L water", progress: 1.5, target: 2 },
  ]);

  const [lastWeekData] = useState<ChallengeData[]>([
    { challenge: "10k Steps", progress: 9500, target: 10000 },
    { challenge: "Meditate 30 mins", progress: 25, target: 30 },
    { challenge: "Read 3 books", progress: 3, target: 3 },
    { challenge: "Drink 2L water", progress: 2, target: 2 },
  ]);

  const [thisMonthData] = useState<ChallengeData[]>([
    { challenge: "10k Steps", progress: 35000, target: 40000 },
    { challenge: "Meditate 30 mins", progress: 90, target: 120 },
    { challenge: "Read 3 books", progress: 10, target: 12 },
    { challenge: "Drink 2L water", progress: 7, target: 8 },
  ]);

  const renderChallengeChart = (data: ChallengeData[], title: string) => (
    <Card className="border-[#C0C0C0] mb-6">
      <CardHeader className="bg-[#0F52BA] text-white">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-[#87CEEB]">Challenge progress</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="challenge" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#0F52BA" name="Progress" />
            <Bar dataKey="target" fill="#87CEEB" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Weekly Challenge Status</h1>

      <Tabs defaultValue="currentWeek" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="currentWeek" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Current Week</TabsTrigger>
          <TabsTrigger value="lastWeek" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Last Week</TabsTrigger>
          <TabsTrigger value="thisMonth" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="currentWeek">
          {renderChallengeChart(currentWeekData, "Current Week's Challenges")}
        </TabsContent>

        <TabsContent value="lastWeek">
          {renderChallengeChart(lastWeekData, "Last Week's Challenges")}
        </TabsContent>

        <TabsContent value="thisMonth">
          {renderChallengeChart(thisMonthData, "This Month's Challenges")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyChallengeStatus;