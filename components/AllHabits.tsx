"use client";
import React, { useState, useEffect } from 'react';

interface Habit {
  id: number;
  name: string;
  description: string | null;
  frequency: string;
  timeOfDay: string | null;
  isActive: boolean;
}

const AllsHabits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaysHabits();
  }, []);

  const fetchTodaysHabits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/habits/all', {
        headers: {
          'x-user-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch habits');
      }
      const data = await response.json();
      setHabits(data.habits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (id: number) => {
    try {
      const response = await fetch(`/api/habits/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle habit');
      }

      const data = await response.json();
      setHabits(habits.map(habit => 
        habit.id === id ? { ...habit, isActive: !habit.isActive } : habit
      ));
    } catch (error) {
      console.error('Error toggling habit:', error);
      setError('Failed to update habit. Please try again.');
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading habits...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Habits</h3>
      {habits.length === 0 ? (
        <p className="text-gray-500">No habits scheduled for today. Why not add one?</p>
      ) : (
        <ul className="space-y-3">
          {habits.map((habit) => (
            <li key={habit.id} className="flex items-center bg-gray-50 p-3 rounded-lg">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                  habit.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {habit.isActive ? '✓' : '✗'}
              </button>
              <div className="flex-grow">
                <h4 className={`font-medium ${habit.isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                  {habit.name}
                </h4>
                {habit.description && (
                  <p className="text-sm text-gray-500">{habit.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {habit.frequency} {habit.timeOfDay && `- ${habit.timeOfDay}`}
                </p>
              </div>
              <span className={`text-sm ${habit.isActive ? 'text-green-500' : 'text-red-500'}`}>
                {habit.isActive ? 'Active' : 'Inactive'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllsHabits;