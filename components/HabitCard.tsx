import React from 'react';
import { MoreVertical, TrendingUp, Clock } from "lucide-react";

export type Habit = {
  id: number;
  name: string;
  status: 'Check-in' | 'Daily Achieved' | 'On Track' | 'Completed' | 'Upcoming';
  progress: {
    current: number;
    total: number;
  };
  streak: number;
  frequency: string;
  frequencyDays: string[];
  nextOccurrence: string;
  habitType: string;
  endDate?: string;
};

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  // Safety check for habit prop
  if (!habit) {
    return null;
  }

  const getStatusStyle = (status: Habit['status']) => {
    switch (status) {
      case 'Check-in':
        return 'bg-white border border-gray-200 text-gray-700';
      case 'Daily Achieved':
        return 'bg-blue-100 text-blue-700';
      case 'On Track':
        return 'bg-yellow-400 text-yellow-900';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Upcoming':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(habit.status)}`}>
            {habit.status || 'No Status'}
          </div>
          <button className="rounded-full p-1 hover:bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 8L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 rounded-full bg-gray-200 relative cursor-pointer">
            <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-white"></div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Habit Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{habit.name || 'Unnamed Habit'}</h3>
        
        <div className="flex items-center text-gray-500 text-sm">
          <span>{habit.habitType || 'No Type'}</span>
          {habit.streak > 0 && (
            <div className="flex items-center ml-2">
              <span className="inline-block w-4 h-4">🔥</span>
              <span>{habit.streak} Days</span>
            </div>
          )}
        </div>

        {habit.frequencyDays && habit.frequencyDays.length > 0 && (
          <div className="flex gap-1">
            {habit.frequencyDays.map((day, index) => (
              <span
                key={index}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm"
              >
                {day}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{habit.nextOccurrence || 'No time set'}</span>
          </div>
          <button className="text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;