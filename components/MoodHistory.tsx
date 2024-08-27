"use client";
import React, { useState, useEffect } from 'react';

interface MoodData {
  mood: string;
  intensity: number;
  timestamp: string;
}

const MoodHistory: React.FC = () => {
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

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'tired': return '😴';
      case 'cool': return '😎';
      case 'confused': return '😕';
      default: return '😐';
    }
  };

  const groupMoodsByDate = (moods: MoodData[]) => {
    const today = new Date();
    const fiveDaysAgo = new Date(today.setDate(today.getDate() - 5));
    
    return moods
      .filter(mood => new Date(mood.timestamp) >= fiveDaysAgo)
      .reduce((acc, mood) => {
        const date = new Date(mood.timestamp).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(mood);
        return acc;
      }, {} as Record<string, MoodData[]>);
  };

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const groupedMoods = groupMoodsByDate(moodData);
  const dates = Object.keys(groupedMoods).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Mood History (Last 5 Days)</h2>
      {dates.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No mood data recorded in the last 5 days.</p>
      ) : (
        <div className="space-y-4">
          {dates.map((date) => (
            <div key={date} className="border-b border-gray-100 pb-2 last:border-b-0">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{date}</h3>
              <div className="flex flex-wrap gap-2">
                {groupedMoods[date].map((mood, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <span className="text-xl mr-1">{getMoodEmoji(mood.mood)}</span>
                    <span className="text-xs font-medium text-gray-700">{mood.mood}</span>
                    <span className="text-xs text-gray-500 ml-1">({mood.intensity})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodHistory;