import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from '@/components/ui/card';

type TimeInterval = '12months' | '30days' | '7days' | '24hours';

interface QuizSummary {
  id: number;
  title: string;
  totalQuestions: number;
  progress: number;
  score: number | null;
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
}

interface HabitSummary {
  id: number;
  name: string;
  completions: number;
}

interface PerformanceData {
  quizzes: QuizSummary[];
  habits: HabitSummary[];
}

const OverallPerformanceSection: React.FC = () => {
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('12months');
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/performance-overall?interval=${timeInterval}`);
        const data: PerformanceData = await response.json();
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [timeInterval]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!performanceData) {
    return <div>No data available for the selected time period.</div>;
  }

  const { quizzes, habits } = performanceData;

  // Combine quiz and habit data into a single dataset
  const combinedData = quizzes.map(quiz => ({
    date: new Date(quiz.startedAt).toLocaleDateString('en-US', { month: 'short' }),
    quizScore: quiz.score || 0,
    quizProgress: quiz.progress,
    habitCompletions: habits.reduce((sum, habit) => sum + habit.completions, 0),
  }));

  return (
    <Card className="bg-white rounded-3xl shadow-lg p-4 w-full max-w-[1512px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Overall Performance</h2>
        <div className="flex space-x-2">
          {[
            { label: '12 months', value: '12months' },
            { label: '30 days', value: '30days' },
            { label: '7 days', value: '7days' },
            { label: '24 hours', value: '24hours' },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTimeInterval(value as TimeInterval)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                timeInterval === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <CardContent className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQuiz" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(253, 97, 15)" stopOpacity={0.8} />
                <stop offset="20%" stopColor="rgb(220, 114, 14)" stopOpacity={0.7} />
                <stop offset="40%" stopColor="rgb(220, 165, 15)" stopOpacity={0.6} />
                <stop offset="60%" stopColor="rgb(202, 204, 14)" stopOpacity={0.5} />
                <stop offset="80%" stopColor="rgb(179, 253, 12)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="rgb(179, 253, 12)" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="colorHabit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 99, 255, 0.6)" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="rgba(0, 99, 255, 0.1)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="quizScore"
              stackId="1"
              stroke="rgb(253, 97, 15)"
              fill="url(#colorQuiz)"
              fillOpacity={1}
            />
            <Area
              type="monotone"
              dataKey="quizProgress"
              stackId="1"
              stroke="rgb(253, 97, 15)"
              fill="url(#colorQuiz)"
              fillOpacity={1}
            />
            <Area
              type="monotone"
              dataKey="habitCompletions"
              stackId="1"
              stroke="rgba(0, 99, 255, 0.6)"
              fill="url(#colorHabit)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-400 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          Great Job!
        </div>
      </CardContent>
      <div className="flex justify-end mt-4 space-x-4">
        <span className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
          Live Data
        </span>
        <span className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
          Selected Duration
        </span>
      </div>
    </Card>
  );
};

export default OverallPerformanceSection;