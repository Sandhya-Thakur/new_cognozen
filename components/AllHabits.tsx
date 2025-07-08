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

type FilterType = 'all' | 'active' | 'inactive';

const AllHabitsCards: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

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
        isActive: habit.isActive ?? true // Default to true if undefined
      }));

      setHabits(formattedHabits);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load habits');
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

  // Filter habits based on active status
  const filteredHabits: Habit[] = habits.filter((habit: Habit) => {
    switch (filter) {
      case 'active':
        return habit.isActive;
      case 'inactive':
        return !habit.isActive;
      default:
        return true;
    }
  });

  // Get current date for display
  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading your habits...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
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
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Building Your Habits</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {habits.length} total habits • {habits.filter(h => h.isActive).length} active
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="bg-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
                     
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                className={filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white'}
                onClick={() => setFilter('all')}
              >
                All ({habits.length})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                className={filter === 'active' ? 'bg-green-600 text-white' : 'bg-white'}
                onClick={() => setFilter('active')}
              >
                Active ({habits.filter(h => h.isActive).length})
              </Button>
              <Button
                variant={filter === 'inactive' ? 'default' : 'outline'}
                className={filter === 'inactive' ? 'bg-gray-600 text-white' : 'bg-white'}
                onClick={() => setFilter('inactive')}
              >
                Inactive ({habits.filter(h => !h.isActive).length})
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

        {/* Habits Grid */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' 
                  ? "No habits yet" 
                  : filter === 'active' 
                    ? "No active habits" 
                    : "No inactive habits"
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "Start building positive habits to track your progress and achieve your goals."
                  : filter === 'active'
                    ? "All your habits are currently inactive. Activate some habits to get started!"
                    : "You don't have any inactive habits. Great job staying active!"
                }
              </p>
              {filter === 'all' && (
                <Button
                  onClick={() => setIsWizardOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Your First Habit
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit: Habit) => 
              <HabitCard 
                key={habit.id} 
                habit={habit}
              />
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