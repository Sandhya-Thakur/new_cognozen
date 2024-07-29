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

  if (isLoading) return <div className="text-center py-4">Loading mood history...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Your Mood History</h2>
      {moodData.length === 0 ? (
        <p className="text-center text-gray-600">No mood data recorded yet.</p>
      ) : (
        <ul className="space-y-4">
          {moodData.map((entry, index) => (
            <li key={index} className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{getMoodEmoji(entry.mood)}</span>
                <span className="text-xl font-semibold">{entry.mood}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  Intensity: {entry.intensity}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoodHistory;