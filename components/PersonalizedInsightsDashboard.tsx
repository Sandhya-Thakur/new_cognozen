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

interface Insight {
  id: number;
  category: string;
  content: string;
}

const PersonalizedInsightsDashboard: React.FC = () => {
  // Example data - replace this with actual data from your backend
  const [liveInsights] = useState<Insight[]>([
    { id: 1, category: "Mood", content: "Your mood seems to improve after meditation sessions. Consider doing a quick meditation now." },
    { id: 2, category: "Productivity", content: "You're most focused between 10 AM and 12 PM. Try scheduling important tasks during this time." },
  ]);

  const [todayInsights] = useState<Insight[]>([
    { id: 1, category: "Sleep", content: "You slept 7 hours last night, which is within your optimal range. Keep it up!" },
    { id: 2, category: "Exercise", content: "You haven't exercised yet today. A quick 15-minute workout could boost your energy levels." },
    { id: 3, category: "Nutrition", content: "Your water intake is below your daily goal. Remember to stay hydrated for better focus." },
  ]);

  const [weekInsights] = useState<Insight[]>([
    { id: 1, category: "Habits", content: "Great job maintaining your reading habit this week! You've read for 30 minutes every day." },
    { id: 2, category: "Stress", content: "Your stress levels seem higher than usual this week. Consider trying some relaxation techniques." },
    { id: 3, category: "Social", content: "You've had fewer social interactions this week. Reaching out to a friend might improve your mood." },
  ]);

  const [monthInsights] = useState<Insight[]>([
    { id: 1, category: "Progress", content: "You've made significant progress on your 'Learn a new language' goal this month!" },
    { id: 2, category: "Health", content: "Your exercise consistency has improved by 20% compared to last month. Keep up the good work!" },
    { id: 3, category: "Productivity", content: "You've completed 15% more tasks this month compared to your monthly average." },
    { id: 4, category: "Wellbeing", content: "Your overall mood this month has been more positive than last month. The increase in outdoor activities might be contributing to this." },
  ]);

  const renderInsights = (insights: Insight[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="border-[#C0C0C0]">
          <CardHeader className="bg-[#0F52BA] text-white">
            <CardTitle className="text-lg">{insight.category}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-4">
            <p>{insight.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Personalized Insights</h1>

      <Tabs defaultValue="live" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Insights</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Today's Insights</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Weekly Insights</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Monthly Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          {renderInsights(liveInsights)}
        </TabsContent>

        <TabsContent value="today">
          {renderInsights(todayInsights)}
        </TabsContent>

        <TabsContent value="week">
          {renderInsights(weekInsights)}
        </TabsContent>

        <TabsContent value="month">
          {renderInsights(monthInsights)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizedInsightsDashboard;