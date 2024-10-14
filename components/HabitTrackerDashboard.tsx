import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface Habit {
  id: number;
  name: string;
  frequency: string;
  timeOfDay: string;
  isActive: boolean;
}

interface Completion {
  completedAt: string;
  value: number;
}

interface HabitCompletion {
  habit: Habit;
  completions: Completion[];
}

const HABIT_COLORS = [
  "#FFD54F", "#81C784", "#64B5F6", "#E0E0E0", "#BDBDBD", "#EF9A9A", "#90CAF9", "#5C6BC0"
];

const HabitTrackerDashboard: React.FC = () => {
  const [habitData, setHabitData] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'tenDays' | 'month'>('month');

  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        const habitsResponse = await axios.get<{ habits: Habit[] }>('/api/habits/all');
        const habits = habitsResponse.data.habits;

        const completionsPromises = habits.map(habit =>
          axios.get<{ completions: Completion[] }>(`/api/habits/completions?habitId=${habit.id}&days=30`)
        );
        const completionsResponses = await Promise.all(completionsPromises);

        const habitCompletions = habits.map((habit, index) => ({
          habit,
          completions: completionsResponses[index].data.completions
        }));

        setHabitData(habitCompletions);
      } catch (error) {
        console.error("Failed to fetch habit data", error);
        setError("Failed to fetch habit data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabitData();
  }, []);

  const processData = (data: HabitCompletion[], startDate: Date, endDate: Date, groupBy: 'hour' | 'day' | 'week') => {
    const groupedData: { [key: string]: { [habit: string]: number } } = {};

    data.forEach(({ habit, completions }) => {
      completions.forEach(completion => {
        const date = parseISO(completion.completedAt);
        if (date >= startDate && date <= endDate) {
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
          if (!groupedData[key][habit.name]) {
            groupedData[key][habit.name] = 0;
          }
          groupedData[key][habit.name] += completion.value;
        }
      });
    });

    return Object.entries(groupedData).map(([timestamp, habits]) => ({
      timestamp,
      ...habits,
    }));
  };

  const getTodayData = () => processData(habitData, startOfDay(new Date()), endOfDay(new Date()), 'hour');
  const getTenDaysData = () => processData(habitData, subDays(new Date(), 10), new Date(), 'day');
  const getMonthData = () => processData(habitData, startOfMonth(new Date()), endOfMonth(new Date()), 'week');

  const renderHabitChart = (data: any[], title: string) => (
    <Card className="border-[#C8E6C9] mb-6">
      <CardHeader className="bg-[#E8F5E9] text-[#1B5E20]">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-[#2E7D32]">Distribution of habits over time</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {habitData.map((habitCompletion, index) => (
              <Bar 
                key={habitCompletion.habit.id} 
                dataKey={habitCompletion.habit.name} 
                stackId="a" 
                fill={HABIT_COLORS[index % HABIT_COLORS.length]} 
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

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 bg-[#F1F8E9]">
      <h1 className="text-xl font-bold mb-8 text-[#1B5E20]">Habit Summary</h1>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'today' | 'tenDays' | 'month')} className="mb-12">
        <TabsList className="bg-[#C8E6C9] text-[#1B5E20]">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Today</TabsTrigger>
          <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Last 10 Days</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {renderHabitChart(getTodayData(), "Today's Habit Data")}
        </TabsContent>

        <TabsContent value="tenDays">
          {renderHabitChart(getTenDaysData(), "Last 10 Days Habit Data")}
        </TabsContent>

        <TabsContent value="month">
          {renderHabitChart(getMonthData(), "This Month's Habit Data")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitTrackerDashboard;