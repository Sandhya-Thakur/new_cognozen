// components/CreateChallengeComponent.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Habit {
  id: number;
  name: string;
}

const CreateChallengeComponent: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [habitId, setHabitId] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits/all');
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/habits/weekly-challenge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          title,
          description,
          startDate,
          endDate,
          habitId: parseInt(habitId),
          targetValue: parseInt(targetValue),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      const data = await response.json();
      toast.success('Challenge created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setHabitId('');
      setTargetValue('');
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('Failed to create challenge. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Create New Challenge</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Challenge Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Challenge Description"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={habitId}
          onChange={(e) => setHabitId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Associated Habit (Optional)</option>
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder="Target Value"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Create Challenge
        </button>
      </form>
    </div>
  );
};

export default CreateChallengeComponent;