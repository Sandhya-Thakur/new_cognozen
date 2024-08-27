"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfDay, subDays, format } from 'date-fns';

interface MoodData {
  mood: string;
  intensity: number;
  timestamp: string;
}

interface MoodIntensity {
  mood: string;
  today: number;
  yesterday: number;
}

const moodColors = {
  Happy: "#22c55e",
  Cool: "#3b82f6",
  Confused: "#f59e0b",
  Tired: "#8b5cf6",
  Sad: "#64748b",
  Angry: "#ef4444",
};

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

  const getComparisonData = (): MoodIntensity[] => {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    const todayData = moodData.filter(entry => new Date(entry.timestamp) >= today);
    const yesterdayData = moodData.filter(entry => new Date(entry.timestamp) >= yesterday && new Date(entry.timestamp) < today);

    const moodIntensities: { [key: string]: MoodIntensity } = {};

    const calculateAverageIntensity = (data: MoodData[]) => {
      const intensities: { [key: string]: number[] } = {};
      data.forEach(entry => {
        if (!intensities[entry.mood]) intensities[entry.mood] = [];
        intensities[entry.mood].push(entry.intensity);
      });
      return Object.entries(intensities).reduce((acc, [mood, values]) => {
        acc[mood] = values.reduce((sum, val) => sum + val, 0) / values.length;
        return acc;
      }, {} as { [key: string]: number });
    };

    const todayIntensities = calculateAverageIntensity(todayData);
    const yesterdayIntensities = calculateAverageIntensity(yesterdayData);

    Object.keys(moodColors).forEach(mood => {
      moodIntensities[mood] = {
        mood,
        today: todayIntensities[mood] || 0,
        yesterday: yesterdayIntensities[mood] || 0
      };
    });

    return Object.values(moodIntensities);
  };

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading mood comparison...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const comparisonData = getComparisonData();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Mood Comparison: Today vs Yesterday
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {comparisonData.every(item => item.today === 0 && item.yesterday === 0) ? (
          <p className="text-center text-gray-600">No mood data available for comparison.</p>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis label={{ value: 'Average Intensity', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
                          <p className="font-medium text-gray-800">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : 'N/A'}`}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="today" fill="#8884d8" name="Today" />
                <Bar dataKey="yesterday" fill="#82ca9d" name="Yesterday" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Today: {format(new Date(), 'MMMM d, yyyy')}</p>
          <p>Yesterday: {format(subDays(new Date(), 1), 'MMMM d, yyyy')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMoodComparison;