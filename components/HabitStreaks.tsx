// components/HabitStreaks.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface HabitStat {
  id: number;
  name: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

const HabitStreaks: React.FC = () => {
  const [stats, setStats] = useState<HabitStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHabitStats();
  }, []);

  const fetchHabitStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/habits/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch habit stats');
      }
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching habit stats:', error);
      toast.error('Failed to load habit statistics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading habit statistics...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Habit Streaks and Statistics</h3>
      {stats.length === 0 ? (
        <p className="text-gray-500">No habit statistics available yet. Keep working on your habits!</p>
      ) : (
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-lg text-gray-800">{stat.name}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-xl font-bold text-indigo-600">{stat.currentStreak} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Longest Streak</p>
                  <p className="text-xl font-bold text-green-600">{stat.longestStreak} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-xl font-bold text-yellow-600">{stat.completionRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Completions</p>
                  <p className="text-xl font-bold text-blue-600">{stat.totalCompletions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitStreaks;