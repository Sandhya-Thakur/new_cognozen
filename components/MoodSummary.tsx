import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface MoodData {
  id: number;
  userId: string;
  mood: string;
  intensity: number;
  timestamp: string;
}

interface Mood {
  mood: string;
  image: string;
  color: string;
}

const moods: Mood[] = [
  { mood: "Happy", image: "😊", color: "#FFD54F" },
  { mood: "Content", image: "🙂", color: "#81C784" },
  { mood: "Calm", image: "😌", color: "#64B5F6" },
  { mood: "Neutral", image: "😐", color: "#E0E0E0" },
  { mood: "Bored", image: "😒", color: "#BDBDBD" },
  { mood: "Frustrated", image: "😠", color: "#EF9A9A" },
  { mood: "Sad", image: "😢", color: "#90CAF9" },
  { mood: "Depressed", image: "😞", color: "#5C6BC0" },
];

const MOOD_COLORS = Object.fromEntries(moods.map(mood => [mood.mood, mood.color]));

const MoodSummary: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'tenDays' | 'month'>('month');

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.get<MoodData[]>('/api/get-mood-data');
        setMoodData(response.data);
      } catch (error) {
        console.error("Failed to fetch mood data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  const processData = (data: MoodData[], startDate: Date, endDate: Date, groupBy: 'hour' | 'day' | 'week') => {
    const filteredData = data.filter(item => {
      const itemDate = parseISO(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });

    const groupedData: { [key: string]: { [mood: string]: number } } = {};

    filteredData.forEach(item => {
      const date = parseISO(item.timestamp);
      let key;
      if (groupBy === 'hour') {
        key = format(date, 'HH:mm');
      } else if (groupBy === 'day') {
        key = format(date, 'MMM dd');
      } else {
        key = `Week ${format(date, 'w')}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = {};
      }
      if (!groupedData[key][item.mood]) {
        groupedData[key][item.mood] = 0;
      }
      groupedData[key][item.mood] += item.intensity;
    });

    return Object.entries(groupedData).map(([timestamp, moods]) => ({
      timestamp,
      ...moods,
    }));
  };

  const getTodayData = () => processData(moodData, startOfDay(new Date()), endOfDay(new Date()), 'hour');
  const getTenDaysData = () => processData(moodData, subDays(new Date(), 10), new Date(), 'day');
  const getMonthData = () => processData(moodData, startOfMonth(new Date()), endOfMonth(new Date()), 'week');

  const renderMoodChart = (data: any[], title: string) => (
    <Card className="border-[#C8E6C9] mb-6">
      <CardHeader className="bg-[#E8F5E9] text-[#1B5E20]">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-[#2E7D32]">Distribution of moods over time</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {moods.map((mood) => (
              <Bar 
                key={mood.mood} 
                dataKey={mood.mood} 
                stackId="a" 
                fill={mood.color} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader className="animate-spin text-[#4CAF50]" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 bg-[#F1F8E9]">
      <h1 className="text-xl font-bold mb-8 text-[#1B5E20]">Mood Summary</h1>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'today' | 'tenDays' | 'month')} className="mb-12">
        <TabsList className="bg-[#C8E6C9] text-[#1B5E20]">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Today</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Last 10 Days</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {renderMoodChart(getTodayData(), "Today's Mood Data")}
        </TabsContent>

        <TabsContent value="tenDays">
          {renderMoodChart(getTenDaysData(), "Last 10 Days Mood Data")}
        </TabsContent>

        <TabsContent value="month">
          {renderMoodChart(getMonthData(), "This Month's Mood Data")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodSummary;