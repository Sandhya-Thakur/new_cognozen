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
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LiveAttentionData from "@/components/LiveAttentionData";

interface AttentionData {
  timestamp: string;
  readingLevel: number;
  quizLevel: number;
}

const AttentionDataDashboard: React.FC = () => {
  const [todayData, setTodayData] = useState<AttentionData[]>([]);
  const [tenDaysData, setTenDaysData] = useState<AttentionData[]>([]);
  const [monthData, setMonthData] = useState<AttentionData[]>([]);

  useEffect(() => {
    // ... (rest of the useEffect code remains the same)
  }, []);

  const renderAttentionChart = (data: AttentionData[], title: string, dataKey: 'readingLevel' | 'quizLevel', titleSize: string = 'text-2xl') => (
    <Card className="border-[#C0C0C0] mb-6">
      <CardHeader className="bg-[#0F52BA] text-white">
        <CardTitle className={titleSize}>{title}</CardTitle>
        <CardDescription className="text-[#87CEEB]">
          {dataKey === 'readingLevel' ? 'Reading Attention Levels' : 'Quiz Attention Levels'}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={dataKey === 'readingLevel' ? "#0F52BA" : "#87CEEB"}
              strokeWidth={2}
              name={dataKey === 'readingLevel' ? "Reading" : "Quiz"}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Attention Data</h1>

      <Tabs defaultValue="live" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Today&apos;s Data</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Last 10 Days</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <Card className="border-[#C0C0C0] mb-6">
            <CardHeader className="bg-[#0F52BA] text-white">
              <CardTitle className="text-lg">Live Attention Data</CardTitle>
              <CardDescription className="text-[#87CEEB]">Real-time attention levels</CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <LiveAttentionData />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today">
          {renderAttentionChart(todayData, "Today&apos;s Reading Attention Levels", "readingLevel", "text-lg")}
          {renderAttentionChart(todayData, "Today&apos;s Quiz Attention Levels", "quizLevel", "text-lg")}
        </TabsContent>

        <TabsContent value="tenDays">
          {renderAttentionChart(tenDaysData, "Last 10 Days Reading Attention Levels", "readingLevel", "text-lg")}
          {renderAttentionChart(tenDaysData, "Last 10 Days Quiz Attention Levels", "quizLevel", "text-lg")}
        </TabsContent>

        <TabsContent value="month">
          {renderAttentionChart(monthData, "This Month&apos;s Reading Attention Levels", "readingLevel", "text-lg")}
          {renderAttentionChart(monthData, "This Month&apos;s Quiz Attention Levels", "quizLevel", "text-lg")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttentionDataDashboard;