import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';

type HabitItem = {
  name: string;
  status: 'Completed' | 'Check-in' | 'Daily Achieved' | 'Missed' | 'Upcoming';
  progress?: string;
  icon: '⭐' | '🔥';
};

const TodaysFocusCard: React.FC = () => {
  const habits: HabitItem[] = [
    { name: "Winter Bathing", status: "Completed", progress: "10 of 10 Day Challenge", icon: "⭐" },
    { name: "Evening Meditation", status: "Check-in", icon: "🔥" },
    { name: "Read 5 Chapters", status: "Daily Achieved", progress: "6 days", icon: "🔥" },
    { name: "Daily Water Intake, 3L", status: "Daily Achieved", progress: "23 days", icon: "🔥" },
    { name: "Morning Meditation", status: "Missed", progress: "45 of 365 Day Challenge", icon: "⭐" },
    { name: "Morning Run, 5k", status: "Upcoming", progress: "0 of 30 Day Challenge", icon: "⭐" },
  ];

  return (
    <Card className="w-full max-w-sm rounded-xl">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Today Focus</CardTitle>
          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">↑ 8.25%</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="my-4 relative">
          <svg className="w-full h-32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="10" strokeDasharray="283" strokeDashoffset="31" transform="rotate(-90 50 50)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#84cc16" />
                <stop offset="50%" stopColor="#bef264" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">89%</span>
          </div>
        </div>
        <div className="space-y-3">
          {habits.map((habit, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{habit.icon}</span>
                <div>
                  <div className="font-medium">{habit.name}</div>
                  {habit.progress && <div className="text-xs text-gray-500">{habit.progress}</div>}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(habit.status)}`}>
                {habit.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Check-in': return 'bg-orange-100 text-orange-800';
    case 'Daily Achieved': return 'bg-blue-100 text-blue-800';
    case 'Missed': return 'bg-red-100 text-red-800';
    case 'Upcoming': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default TodaysFocusCard;