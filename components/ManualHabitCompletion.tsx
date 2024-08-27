// components/ManualHabitCompletion.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Habit {
  id: number;
  name: string;
}

const ManualHabitCompletion: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionValue, setCompletionValue] = useState(1);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits/all");
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits);
      } else {
        console.error("Failed to fetch habits");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit) {
      toast.error('Please select a habit');
      return;
    }

    try {
      const response = await fetch('/api/habits/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitId: selectedHabit,
          completedAt: completionDate,
          value: completionValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add completion');
      }

      toast.success('Habit completion added successfully');
      setSelectedHabit(null);
      setCompletionDate(new Date().toISOString().split('T')[0]);
      setCompletionValue(1);
    } catch (error) {
      console.error('Error adding completion:', error);
      toast.error('Failed to add completion. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Manual Habit Completion</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedHabit || ''}
          onChange={(e) => setSelectedHabit(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select a habit</option>
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={completionDate}
          onChange={(e) => setCompletionDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          value={completionValue}
          onChange={(e) => setCompletionValue(Number(e.target.value))}
          min="1"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Completion
        </button>
      </form>
    </div>
  );
};

export default ManualHabitCompletion;