"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EmotionData {
  timestamp: string;
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  surprised: number;
  fearful: number;
  disgusted: number;
}

const EMOTIONS = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'];
const COLORS = {
  happy: '#4CAF50',
  sad: '#2196F3',
  angry: '#F44336',
  neutral: '#9E9E9E',
  surprised: '#FFC107',
  fearful: '#673AB7',
  disgusted: '#795548'
};

const AllEmotionsDataDashboard: React.FC = () => {
  const [liveReadData, setLiveReadData] = useState<EmotionData[]>([]);
  const [liveQuizData, setLiveQuizData] = useState<EmotionData[]>([]);
  const [todayReadData, setTodayReadData] = useState<EmotionData[]>([]);
  const [todayQuizData, setTodayQuizData] = useState<EmotionData[]>([]);
  const [tenDaysReadData, setTenDaysReadData] = useState<EmotionData[]>([]);
  const [tenDaysQuizData, setTenDaysQuizData] = useState<EmotionData[]>([]);
  const [monthReadData, setMonthReadData] = useState<EmotionData[]>([]);
  const [monthQuizData, setMonthQuizData] = useState<EmotionData[]>([]);

  useEffect(() => {
    // ... (useEffect code remains unchanged)
  }, []);

  const renderEmotionsChart = (data: EmotionData[], title: string, titleSize: string = 'text-2xl') => (
    <Card className="border-[#C0C0C0] mb-6">
      <CardHeader className="bg-[#0F52BA] text-white">
        <CardTitle className={titleSize}>{title}</CardTitle>
        <CardDescription className="text-[#87CEEB]">Distribution of emotions over time</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            {EMOTIONS.map((emotion) => (
              <Bar 
                key={emotion} 
                dataKey={emotion} 
                stackId="a" 
                fill={COLORS[emotion as keyof typeof COLORS]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Emotions Data </h1>

      <Tabs defaultValue="live" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Today's Data</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Last 10 Days</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          {renderEmotionsChart(liveReadData, "Live Read Emotions Data", "text-lg")}
          {renderEmotionsChart(liveQuizData, "Live Quiz Emotions Data", "text-lg")}
        </TabsContent>

        <TabsContent value="today">
          {renderEmotionsChart(todayReadData, "Today's Read Emotions Data", "text-lg")}
          {renderEmotionsChart(todayQuizData, "Today's Quiz Emotions Data", "text-lg")}
        </TabsContent>

        <TabsContent value="tenDays">
          {renderEmotionsChart(tenDaysReadData, "Last 10 Days Read Emotions Data", "text-lg")}
          {renderEmotionsChart(tenDaysQuizData, "Last 10 Days Quiz Emotions Data", "text-lg")}
        </TabsContent>

        <TabsContent value="month">
          {renderEmotionsChart(monthReadData, "This Month's Read Emotions Data", "text-lg")}
          {renderEmotionsChart(monthQuizData, "This Month's Quiz Emotions Data", "text-lg")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllEmotionsDataDashboard;