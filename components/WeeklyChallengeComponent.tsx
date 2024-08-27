// components/WeeklyChallengeComponent.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface WeeklyChallenge {
  id: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  targetValue: number;
}

interface Participation {
  id: number;
  currentProgress: number;
  isCompleted: boolean;
}

interface AssociatedHabit {
  id: number;
  name: string;
}

const WeeklyChallengeComponent: React.FC = () => {
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [participation, setParticipation] = useState<Participation | null>(null);
  const [associatedHabit, setAssociatedHabit] = useState<AssociatedHabit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyChallenge();
  }, []);

  const fetchWeeklyChallenge = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/habits/weekly-challenge/[id]');
      if (!response.ok) {
        throw new Error('Failed to fetch weekly challenge');
      }
      const data = await response.json();
      if (data.challenge) {
        setChallenge(data.challenge);
        setParticipation(data.participation);
        setAssociatedHabit(data.associatedHabit);
      }
    } catch (error) {
      console.error('Error fetching weekly challenge:', error);
      toast.error('Failed to load weekly challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!challenge || !participation) return;

    try {
      const response = await fetch('/api/weekly-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id, progress: newProgress }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      setParticipation(data.participation);
      toast.success('Progress updated successfully!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress. Please try again.');
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading weekly challenge...</div>;

  if (!challenge) return <div className="text-center py-4">No active challenge this week.</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Weekly Challenge</h3>
      <h4 className="text-lg font-medium mb-2">{challenge.title}</h4>
      {challenge.description && <p className="text-gray-600 mb-4">{challenge.description}</p>}
      {associatedHabit && (
        <p className="text-sm text-blue-600 mb-2">Associated Habit: {associatedHabit.name}</p>
      )}
      <p className="text-sm text-gray-500 mb-4">
        {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
      </p>
      {participation && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Progress: {participation.currentProgress} / {challenge.targetValue}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round((participation.currentProgress / challenge.targetValue) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(participation.currentProgress / challenge.targetValue) * 100}%` }}
            ></div>
          </div>
          <button
            onClick={() => updateProgress(participation.currentProgress + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Log Progress
          </button>
          {participation.isCompleted && (
            <p className="text-green-500 font-semibold mt-4">Challenge Completed! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyChallengeComponent;