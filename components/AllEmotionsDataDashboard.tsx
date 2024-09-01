"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EmotionData {
  timestamp: string;
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
}

const AllEmotionsDataDashboard: React.FC = () => {
  const [todayData, setTodayData] = useState<EmotionData[]>([]);
  const [weekData, setWeekData] = useState<EmotionData[]>([]);
  const [monthData, setMonthData] = useState<EmotionData[]>([]);

  useEffect(() => {
    // Fetch data here
    // For example:
    // fetchTodayData().then(setTodayData);
    // fetchWeekData().then(setWeekData);
    // fetchMonthData().then(setMonthData);
  }, []);

  const renderEmotionChart = (data: EmotionData[], title: string) => (
    <Card className="border-gray-200 mb-6">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="joy" stroke="#FFD700" strokeWidth={2} name="Joy" />
            <Line type="monotone" dataKey="sadness" stroke="#4169E1" strokeWidth={2} name="Sadness" />
            <Line type="monotone" dataKey="anger" stroke="#FF4500" strokeWidth={2} name="Anger" />
            <Line type="monotone" dataKey="fear" stroke="#8B008B" strokeWidth={2} name="Fear" />
            <Line type="monotone" dataKey="surprise" stroke="#00FF7F" strokeWidth={2} name="Surprise" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
       <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Emotions Data Dashboard</h1>

       <Tabs defaultValue="live" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Current Day Data</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Last 10 Days</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <Card className="border-[#C0C0C0] mb-6">
            <CardHeader className="bg-[#0F52BA] text-white">
              <CardTitle className="text-lg">Live Emotions Data</CardTitle>
              <CardDescription className="text-[#87CEEB]">Real-time emotion data</CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-6">
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="today">
          {renderEmotionChart(todayData, "Current Day Emotional Journey")}
        </TabsContent>

        <TabsContent value="week">
          {renderEmotionChart(weekData, "This Week Emotional Trends")}
        </TabsContent>

        <TabsContent value="month">
          {renderEmotionChart(monthData, "This Month Emotional Overview")}
        </TabsContent>
      </Tabs>

      <Card className="border-gray-200 mb-6">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl">Emotional Insights</CardTitle>
          <CardDescription className="text-blue-200">
            Understanding your emotional patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <p>
            Your emotions play a crucial role in your overall well-being. Here are our observations:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Your joy levels tend to peak in the mornings.</li>
            <li>Stress seems to be higher on weekdays compared to weekends.</li>
            <li>You have shown great resilience in managing anger over the past month.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllEmotionsDataDashboard;