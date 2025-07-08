'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Clock, CheckCircle2, Circle, RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardHabit {
  id: number;
  name: string;
  status: "Check-in" | "Daily Achieved" | "On Track" | "Completed" | "Upcoming";
  streak: number;
  frequency: string;
  isActive: boolean;
}

interface ApiResponse {
  habits: DashboardHabit[];
  total: number;
  active: number;
}

const DashboardAllHabit: React.FC = () => {
  const [habits, setHabits] = useState<DashboardHabit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

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
      setHabits(data.habits || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Filter active habits and limit display
  const activeHabits = habits.filter(habit => habit.isActive);
  const displayHabits = showAll ? activeHabits : activeHabits.slice(0, 3);

  // Calculate metrics
  const totalHabits = habits.length;
  const activeCount = activeHabits.length;
  const achievedToday = activeHabits.filter(h => h.status === "Daily Achieved").length;
  const totalStreak = activeHabits.reduce((sum, habit) => sum + habit.streak, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Daily Achieved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "On Track":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "Check-in":
        return <Circle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Daily Achieved":
        return "text-green-600";
      case "On Track":
        return "text-blue-600";
      case "Check-in":
        return "text-orange-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">My Habits</h3>
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600 mb-2">{error}</p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={fetchHabits}
          className="text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with metrics */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Habits</h3>
          <p className="text-xs text-gray-500">{activeCount} active • {achievedToday} completed today</p>
        </div>
        <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-blue-600">{activeCount}</div>
          <div className="text-xs text-blue-500">Active</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-600">{achievedToday}</div>
          <div className="text-xs text-green-500">Today</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-orange-600">{totalStreak}</div>
          <div className="text-xs text-orange-500">Streak</div>
        </div>
      </div>

      {/* Habits List */}
      {activeHabits.length === 0 ? (
        <div className="text-center py-4">
          <Circle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">No active habits</p>
          <Button size="sm" variant="outline" className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add Habit
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayHabits.map((habit) => (
            <div 
              key={habit.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getStatusIcon(habit.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {habit.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getStatusColor(habit.status)}`}>
                      {habit.status}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {habit.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show More/Less Button */}
          {activeHabits.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAll(!showAll)}
              className="w-full text-xs text-gray-500 hover:text-gray-700"
            >
              {showAll ? 'Show Less' : `Show ${activeHabits.length - 3} More`}
            </Button>
          )}
        </div>
      )}

      {/* Quick Action */}
      <div className="pt-2 border-t border-gray-100">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={fetchHabits}
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default DashboardAllHabit;