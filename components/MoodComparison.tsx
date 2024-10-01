import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfDay, subDays, format } from 'date-fns';

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
  mood: string;
  image: string;
  today: number;
  yesterday: number;
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

  const getComparisonData = (): MoodSummary[] => {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    const todayData = moodData.filter(entry => new Date(entry.timestamp) >= today);
    const yesterdayData = moodData.filter(entry => new Date(entry.timestamp) >= yesterday && new Date(entry.timestamp) < today);

    const calculateMoodPercentages = (data: MoodData[]) => {
      const totalEntries = data.length;
      return moods.reduce((acc, { mood }) => {
        const count = data.filter(entry => entry.mood === mood).length;
        acc[mood] = (count / totalEntries) * 100 || 0;
        return acc;
      }, {} as { [key: string]: number });
    };

    const todayPercentages = calculateMoodPercentages(todayData);
    const yesterdayPercentages = calculateMoodPercentages(yesterdayData);

    return moods.map(({ mood, image }) => ({
      mood,
      image,
      today: todayPercentages[mood],
      yesterday: yesterdayPercentages[mood],
    }));
  };

  const calculateDominantMood = (data: MoodSummary[]): { mood: string; image: string; percentage: number } => {
    const dominantToday = data.reduce((max, item) => item.today > max.percentage ? { mood: item.mood, image: item.image, percentage: item.today } : max, { mood: '', image: '', percentage: 0 });
    return dominantToday;
  };

  const calculateMoodShift = (data: MoodSummary[]): { mood: string; image: string; shift: number } => {
    const maxShift = data.reduce((max, item) => {
      const shift = item.today - item.yesterday;
      return Math.abs(shift) > Math.abs(max.shift) ? { mood: item.mood, image: item.image, shift } : max;
    }, { mood: '', image: '', shift: 0 });
    return maxShift;
  };

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading mood comparison...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const comparisonData = getComparisonData();
  const dominantMood = calculateDominantMood(comparisonData);
  const moodShift = calculateMoodShift(comparisonData);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Comprehensive Mood Comparison: Today vs Yesterday
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Dominant Mood Today: 
            <span className="ml-2 text-lg">{dominantMood.image} {dominantMood.mood} ({dominantMood.percentage.toFixed(1)}%)</span>
          </p>
          <p className="text-sm font-medium text-gray-700">Biggest Mood Shift: 
            <span className="ml-2 text-lg">
              {moodShift.image} {moodShift.mood} 
              ({moodShift.shift > 0 ? '+' : ''}{moodShift.shift.toFixed(1)}%)
            </span>
          </p>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis dataKey="mood" type="category" />
              <Tooltip
                content={({ payload, label }) => {
                  if (payload && payload.length) {
                    const mood = moods.find(m => m.mood === label);
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
                        <p className="font-medium text-gray-800">{label} {mood?.image}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(1) : 'N/A'}%`}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="yesterday" name="Yesterday" stackId="a" fill="#82ca9d" />
              <Bar dataKey="today" name="Today" stackId="a" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Today: {format(new Date(), 'MMMM d, yyyy')}</p>
          <p>Yesterday: {format(subDays(new Date(), 1), 'MMMM d, yyyy')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMoodComparison;