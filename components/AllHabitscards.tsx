import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Filter } from "lucide-react";
import HabitCard from './HabitCard';
import type { Habit } from './HabitCard';
import HabitCreationWizard from "@/components/HabitCreationWizard";

const AllHabitsCards: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Evening Meditation",
      status: "Check-in",
      progress: { current: 45, total: 365 },
      streak: 45,
      frequency: "Weekly",
      frequencyDays: ["Mo", "We", "Fr"],
      nextOccurrence: "Today, 8 PM",
      habitType: "Routine Habit"
    },
    {
      id: 2,
      name: "Healthy Eating",
      status: "Daily Achieved",
      progress: { current: 10, total: 30 },
      streak: 10,
      frequency: "Daily",
      frequencyDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      nextOccurrence: "Tomorrow, 8 AM",
      habitType: "Routine Habit"
    },
    {
      id: 3,
      name: "Team B Paddle Ball",
      status: "On Track",
      progress: { current: 398, total: 400 },
      streak: 398,
      frequency: "Weekly",
      frequencyDays: ["Mo", "Fr", "Su"],
      nextOccurrence: "Sunday, 8 AM",
      habitType: "Routine Habit"
    }
  ]);

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Building Your Habits</h1>
          
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
                <span>November 10</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits?.map(habit => 
            habit ? <HabitCard key={habit.id} habit={habit} /> : null
          )}
        </div>

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