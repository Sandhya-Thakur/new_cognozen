// components/HabitInsightsComponent.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Habit {
  id: number;
  name: string;
}

interface HabitInsight {
  habitName: string;
  analysis: {
    title: string;
    description: string;
  };
  trends: string[];
  recommendations: {
    title: string;
    description: string;
  }[];
  conclusion: string;
}

const HabitInsightsComponent: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [insights, setInsights] = useState<HabitInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        throw new Error("Failed to fetch habits");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Failed to load habits. Please try again.");
    }
  };

  const generateInsights = async () => {
    if (!selectedHabitId) {
      toast.error("Please select a habit");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/habits/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habitId: selectedHabitId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      toast.success('Insights generated successfully');
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Habit Insights</h3>
      <div className="mb-4">
        <select
          value={selectedHabitId || ''}
          onChange={(e) => setSelectedHabitId(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select a habit</option>
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
      </div>
      <button
        onClick={generateInsights}
        disabled={isLoading || !selectedHabitId}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-300"
      >
        {isLoading ? 'Generating Insights...' : 'Generate Insights'}
      </button>
      {insights && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">{insights.analysis.title}</h4>
          <p className="mb-4">{insights.analysis.description}</p>
          <h5 className="font-semibold mb-2">Trends:</h5>
          <ul className="list-disc pl-5 mb-4">
            {insights.trends.map((trend, index) => (
              <li key={index}>{trend}</li>
            ))}
          </ul>
          <h5 className="font-semibold mb-2">Recommendations:</h5>
          {insights.recommendations.map((rec, index) => (
            <div key={index} className="mb-3">
              <h6 className="font-semibold">{rec.title}</h6>
              <p>{rec.description}</p>
            </div>
          ))}
          <p className="mt-4 font-semibold">{insights.conclusion}</p>
        </div>
      )}
    </div>
  );
};

export default HabitInsightsComponent;