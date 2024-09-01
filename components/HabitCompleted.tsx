// components/HabitCompleted.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface Habit {
  id: number;
  name: string;
}

interface HabitCompletion {
  habitId: number;
  completedAt: string;
  value: number;
}

const HabitCompleted: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchHabitsAndCompletions();

    // Set up daily refresh at midnight
    const setMidnightRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      timeoutRef.current = setTimeout(() => {
        fetchHabitsAndCompletions();
        setMidnightRefresh(); // Set up the next day's refresh
      }, timeUntilMidnight);
    };

    setMidnightRefresh();

    return () => {
      // Clean up any running timers when the component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchHabitsAndCompletions = async () => {
    setLoading(true);
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        fetch('/api/habits/all'),
        fetch('/api/habits/today-completion')
      ]);

      if (habitsResponse.ok && completionsResponse.ok) {
        const habitsData = await habitsResponse.json();
        const completionsData = await completionsResponse.json();
        setHabits(habitsData.habits);
        setCompletions(completionsData.completions);
      } else {
        toast.error('Failed to fetch habits and completions');
      }
    } catch (error) {
      console.error('Error fetching habits and completions:', error);
      toast.error('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const isHabitCompleted = (habitId: number) => {
    return completions.some(completion => completion.habitId === habitId);
  };

  const getCompletionValue = (habitId: number) => {
    const completion = completions.find(c => c.habitId === habitId);
    return completion ? completion.value : 0;
  };

  if (loading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Todays Habit Status</h2>
      {habits.length === 0 ? (
        <p className="text-gray-600">No habits found for today.</p>
      ) : (
        <ul className="space-y-4">
          {habits.map(habit => (
            <li key={habit.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <span className="text-lg font-medium text-gray-700">{habit.name}</span>
              {isHabitCompleted(habit.id) ? (
                <span className="text-green-500 font-semibold">
                  Completed (Value: {getCompletionValue(habit.id)})
                </span>
              ) : (
                <span className="text-red-500 font-semibold">Not Completed</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HabitCompleted;