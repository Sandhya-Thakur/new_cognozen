"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MOOD_COLORS = {
  Happy: '#4CAF50',
  Sad: '#2196F3',
  Angry: '#F44336',
  Neutral: '#9E9E9E',
  Excited: '#FFC107',
  Anxious: '#673AB7',
  Calm: '#00BCD4'
};

interface MoodData {
  timestamp: string;
  Happy: number;
  Sad: number;
  Angry: number;
  Neutral: number;
  Excited: number;
  Anxious: number;
  Calm: number;
}

const MoodSummary: React.FC = () => {
  // Example data - replace with actual data fetching logic
  const [liveData, setLiveData] = useState<MoodData[]>([
    { timestamp: '10:00', Happy: 0.3, Sad: 0.1, Angry: 0.05, Neutral: 0.25, Excited: 0.15, Anxious: 0.08, Calm: 0.07 },
    { timestamp: '11:00', Happy: 0.4, Sad: 0.05, Angry: 0.1, Neutral: 0.2, Excited: 0.1, Anxious: 0.1, Calm: 0.05 },
    // Add more data points as needed
  ]);

  const [todayData, setTodayData] = useState<MoodData[]>([
    { timestamp: 'Morning', Happy: 0.35, Sad: 0.15, Angry: 0.05, Neutral: 0.2, Excited: 0.1, Anxious: 0.1, Calm: 0.05 },
    { timestamp: 'Afternoon', Happy: 0.3, Sad: 0.1, Angry: 0.1, Neutral: 0.25, Excited: 0.15, Anxious: 0.05, Calm: 0.05 },
    { timestamp: 'Evening', Happy: 0.25, Sad: 0.2, Angry: 0.05, Neutral: 0.2, Excited: 0.1, Anxious: 0.1, Calm: 0.1 },
  ]);

  const [tenDaysData, setTenDaysData] = useState<MoodData[]>([
    { timestamp: 'Day 1', Happy: 0.3, Sad: 0.1, Angry: 0.05, Neutral: 0.25, Excited: 0.15, Anxious: 0.08, Calm: 0.07 },
    { timestamp: 'Day 2', Happy: 0.35, Sad: 0.15, Angry: 0.05, Neutral: 0.2, Excited: 0.1, Anxious: 0.1, Calm: 0.05 },
    // Add more data points for 10 days
  ]);

  const [monthData, setMonthData] = useState<MoodData[]>([
    { timestamp: 'Week 1', Happy: 0.3, Sad: 0.1, Angry: 0.05, Neutral: 0.25, Excited: 0.15, Anxious: 0.08, Calm: 0.07 },
    { timestamp: 'Week 2', Happy: 0.35, Sad: 0.15, Angry: 0.05, Neutral: 0.2, Excited: 0.1, Anxious: 0.1, Calm: 0.05 },
    { timestamp: 'Week 3', Happy: 0.25, Sad: 0.2, Angry: 0.1, Neutral: 0.2, Excited: 0.1, Anxious: 0.1, Calm: 0.05 },
    { timestamp: 'Week 4', Happy: 0.3, Sad: 0.1, Angry: 0.05, Neutral: 0.25, Excited: 0.15, Anxious: 0.05, Calm: 0.1 },
  ]);

  const renderMoodChart = (data: MoodData[], title: string) => (
    <Card className="border-[#C0C0C0] mb-6">
      <CardHeader className="bg-[#0F52BA] text-white">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-[#87CEEB]">Distribution of moods over time</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            {Object.keys(MOOD_COLORS).map((mood) => (
              <Bar 
                key={mood} 
                dataKey={mood} 
                stackId="a" 
                fill={MOOD_COLORS[mood as keyof typeof MOOD_COLORS]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Mood Summary</h1>

      <Tabs defaultValue="live" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Today Data</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Last 10 Days</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          {renderMoodChart(liveData, "Live Mood Data")}
        </TabsContent>

        <TabsContent value="today">
          {renderMoodChart(todayData, "Today's Mood Data")}
        </TabsContent>

        <TabsContent value="tenDays">
          {renderMoodChart(tenDaysData, "Last 10 Days Mood Data")}
        </TabsContent>

        <TabsContent value="month">
          {renderMoodChart(monthData, "This Month's Mood Data")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodSummary;