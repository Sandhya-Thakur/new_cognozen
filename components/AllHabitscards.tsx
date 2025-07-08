'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Filter, RefreshCw, AlertCircle } from "lucide-react";
import HabitCard from './HabitCard';
import type { Habit } from './HabitCard';
import HabitCreationWizard from "@/components/HabitCreationWizard";

interface ApiHabit {
  id: number;
  name: string;
  status: "Check-in" | "Daily Achieved" | "On Track" | "Completed" | "Upcoming";
  progress: { current: number; total: number };
  streak: number;
  frequency: string;
  frequencyDays: string[];
  nextOccurrence: string;
  habitType: string;
  isActive: boolean;
  tags: string[];
  timePerSession?: number;
  reminder?: any;
  endDate?: string;
  createdAt: string;
}

interface ApiResponse {
  habits: ApiHabit[];
  total: number;
  active: number;
}

const AllHabitsCards: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch habits from API
  const fetchHabits = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/habits/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch habits: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      // Convert API data to component format with type safety
      const formattedHabits: Habit[] = data.habits.map((habit: ApiHabit) => ({
        id: habit.id,
        name: habit.name,
        status: habit.status as "Check-in" | "Daily Achieved" | "On Track" | "Completed" | "Upcoming",
        progress: habit.progress,
        streak: habit.streak,
        frequency: habit.frequency,
        frequencyDays: habit.frequencyDays,
        nextOccurrence: habit.nextOccurrence,
        habitType: habit.habitType,
        isActive: habit.isActive ?? true
      }));

      setHabits(formattedHabits);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load habits');
      // Don't set dummy data - let user see the error and retry
    } finally {
      setLoading(false);
    }
  };

  // Load habits when component mounts
  useEffect(() => {
    fetchHabits();
  }, []);

  // Handle wizard close and refresh habits
  const handleCloseWizard = (): void => {
    setIsWizardOpen(false);
    // Refresh habits list after creating new habit
    fetchHabits();
  };

  // Handle refresh button
  const handleRefresh = (): void => {
    fetchHabits();
  };

  // Get current date for display
  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Building Your Habits</h1>
            {/* Loading/Error/Refresh indicator */}
            <div className="flex items-center space-x-2">
              {loading && (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              )}
              {error && (
                <div title={error}>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
                     
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="bg-white"
              >
                Today
              </Button>
              <Button
                variant="outline"
                className="bg-white flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{getCurrentDate()}</span>
              </Button>
              <Button
                variant="outline"
                className="bg-white p-2"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
                         
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsWizardOpen(true)}
            >
              + Add Habit
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center min-h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading your habits...</span>
            </div>
          </div>
        ) : error ? (
          // Error State
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Habits</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : habits.length === 0 ? (
          // Empty State (No habits in database)
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
              <p className="text-gray-600 mb-6">
                Start building positive habits to track your progress and achieve your goals.
              </p>
              <Button
                onClick={() => setIsWizardOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Your First Habit
              </Button>
            </div>
          </div>
        ) : (
          // Habits Grid - Show real data from database
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit: Habit) => 
              <HabitCard key={habit.id} habit={habit} />
            )}
          </div>
        )}

        {/* Modal Overlay */}
        {isWizardOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 relative">
              <HabitCreationWizard onClose={handleCloseWizard} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllHabitsCards;