"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MoodData {
  mood: string;
  intensity: number;
  timestamp: string;
}

interface MoodCount {
  mood: string;
  thisWeek: number;
  lastWeek: number;
}

const MoodComparison: React.FC = () => {
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

  const getComparisonData = (): MoodCount[] => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekData = moodData.filter(entry => new Date(entry.timestamp) >= oneWeekAgo);
    const lastWeekData = moodData.filter(entry => new Date(entry.timestamp) >= twoWeeksAgo && new Date(entry.timestamp) < oneWeekAgo);

    const moodCounts: { [key: string]: MoodCount } = {};

    const countMoods = (data: MoodData[], weekKey: 'thisWeek' | 'lastWeek') => {
      data.forEach(entry => {
        if (!moodCounts[entry.mood]) {
          moodCounts[entry.mood] = { mood: entry.mood, thisWeek: 0, lastWeek: 0 };
        }
        moodCounts[entry.mood][weekKey]++;
      });
    };

    countMoods(thisWeekData, 'thisWeek');
    countMoods(lastWeekData, 'lastWeek');

    return Object.values(moodCounts);
  };

  if (isLoading) return <div className="text-center py-4">Loading mood comparison...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const comparisonData = getComparisonData();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Mood Comparison: This Week vs Last Week</h2>
      {comparisonData.length === 0 ? (
        <p className="text-center text-gray-600">No mood data available for comparison.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
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
            <YAxis label={{ value: 'Number of Occurrences', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="thisWeek" fill="#8884d8" name="This Week" />
            <Bar dataKey="lastWeek" fill="#82ca9d" name="Last Week" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodComparison;