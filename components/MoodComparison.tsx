import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfDay, subDays, format } from 'date-fns';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface Mood {
  mood: string;
  image: string;
  color: string;
}

interface MoodData {
  mood: string;
  intensity: number;
  timestamp: string;
}

interface MoodSummary {
  name: string;
  value: number;
  image: string;
}

const moods: Mood[] = [
  { mood: "Happy", image: "😊", color: "bg-yellow-300" },
  { mood: "Content", image: "🙂", color: "bg-green-200" },
  { mood: "Calm", image: "😌", color: "bg-blue-200" },
  { mood: "Neutral", image: "😐", color: "bg-gray-300" },
  { mood: "Bored", image: "😒", color: "bg-gray-200" },
  { mood: "Frustrated", image: "😠", color: "bg-red-400" },
  { mood: "Sad", image: "😢", color: "bg-blue-300" },
  { mood: "Depressed", image: "😞", color: "bg-blue-900" },
];

const moodColors = moods.reduce((acc, mood) => {
  acc[mood.mood] = mood.color.replace('bg-', '#');
  return acc;
}, {} as { [key: string]: string });

const DailyMoodComparison: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch('/api/get-mood-data');
        if (!response.ok) {
          throw new Error('Failed to fetch mood data');
        }
        const data = await response.json();
        setMoodData(data);
      } catch (err) {
        setError('Error fetching mood data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  const getMoodSummary = (data: MoodData[]): MoodSummary[] => {
    const moodCounts = data.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return moods.map(({ mood, image }) => ({
      name: mood,
      value: moodCounts[mood] || 0,
      image: image,
    })).filter(summary => summary.value > 0);
  };

  const getComparisonData = () => {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    const todayData = moodData.filter(entry => new Date(entry.timestamp) >= today);
    const yesterdayData = moodData.filter(entry => new Date(entry.timestamp) >= yesterday && new Date(entry.timestamp) < today);

    return {
      today: getMoodSummary(todayData),
      yesterday: getMoodSummary(yesterdayData),
    };
  };

  const calculateDominantMood = (data: MoodSummary[]): { mood: string; image: string; percentage: number } => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const dominant = data.reduce((max, item) => item.value > max.value ? item : max, { name: '', value: 0, image: '' });
    return {
      mood: dominant.name,
      image: dominant.image,
      percentage: (dominant.value / total) * 100,
    };
  };

  const calculateMoodShift = (today: MoodSummary[], yesterday: MoodSummary[]): { mood: string; image: string; shift: number } => {
    const todayTotal = today.reduce((sum, item) => sum + item.value, 0);
    const yesterdayTotal = yesterday.reduce((sum, item) => sum + item.value, 0);

    const todayPercentages = today.reduce((acc, item) => {
      acc[item.name] = (item.value / todayTotal) * 100;
      return acc;
    }, {} as { [key: string]: number });

    const yesterdayPercentages = yesterday.reduce((acc, item) => {
      acc[item.name] = (item.value / yesterdayTotal) * 100;
      return acc;
    }, {} as { [key: string]: number });

    const shifts = moods.map(({ mood, image }) => ({
      mood,
      image,
      shift: (todayPercentages[mood] || 0) - (yesterdayPercentages[mood] || 0),
    }));

    return shifts.reduce((max, item) => Math.abs(item.shift) > Math.abs(max.shift) ? item : max, { mood: '', image: '', shift: 0 });
  };

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading mood comparison...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const { today, yesterday } = getComparisonData();
  const dominantMood = calculateDominantMood(today);
  const moodShift = calculateMoodShift(today, yesterday);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-xl">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Mood Comparison: Today vs Yesterday
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-xl shadow bg-white">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Today Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={today}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, image }) => `${name} ${image}`}
                      >
                        {today.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={moodColors[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow bg-white">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Yesterday Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={yesterday}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, image }) => `${name} ${image}`}
                      >
                        {yesterday.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={moodColors[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-xl shadow bg-white">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">Dominant Mood Today:</p>
                <p className="text-2xl font-bold mt-2 text-gray-700">
                  {dominantMood.image} {dominantMood.mood} ({dominantMood.percentage.toFixed(1)}%)
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow bg-white">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">Biggest Mood Shift:</p>
                <p className="text-2xl font-bold mt-2 flex items-center text-gray-700">
                  {moodShift.image} {moodShift.mood} 
                  <span className={`ml-2 ${moodShift.shift > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {moodShift.shift > 0 ? <ArrowUpIcon size={24} /> : <ArrowDownIcon size={24} />}
                    {Math.abs(moodShift.shift).toFixed(1)}%
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMoodComparison;