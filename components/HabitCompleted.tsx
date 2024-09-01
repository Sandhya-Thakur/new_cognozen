"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

interface Habit {
  id: string;
  name: string;
  description: string;
  completedDates: string[];
  streak: number;
}

const HabitCompleted: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // In a real application, you&apos;d fetch this data from an API
    const fetchedHabits: Habit[] = [
      { id: '1', name: 'Daily Exercise', description: 'Work out for at least 30 minutes', completedDates: ['2024-09-01', '2024-09-02'], streak: 2 },
      { id: '2', name: 'Meditation', description: 'Meditate for 10 minutes', completedDates: ['2024-09-01'], streak: 1 },
      { id: '3', name: 'Read a Book', description: 'Read for 30 minutes', completedDates: ['2024-09-02'], streak: 1 },
    ];
    setHabits(fetchedHabits);
  }, []);

  const handleHabitCompletion = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId
          ? {
              ...habit,
              completedDates: [...habit.completedDates, selectedDate?.toISOString().split('T')[0] || ''],
              streak: habit.streak + 1
            }
          : habit
      )
    );
  };

  const isHabitCompletedToday = (habit: Habit) => {
    const today = selectedDate?.toISOString().split('T')[0] || '';
    return habit.completedDates.includes(today);
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Habit Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 col-span-2">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-xl">Your Habits</CardTitle>
            <CardDescription className="text-blue-200">
              Track your daily habits
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-6">
            {habits.map(habit => (
              <div key={habit.id} className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <Badge variant="outline">{`Streak: ${habit.streak}`}</Badge>
                </div>
                <p className="text-gray-600 mb-2">{habit.description}</p>
                <Progress value={(habit.completedDates.length / 30) * 100} className="mb-2" />
                <Button 
                  onClick={() => handleHabitCompletion(habit.id)}
                  disabled={isHabitCompletedToday(habit)}
                >
                  {isHabitCompletedToday(habit) ? 'Completed' : 'Mark as Completed'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-xl">Calendar</CardTitle>
            <CardDescription className="text-blue-200">
              Select a date to view or update habits
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 mt-8">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl">Habit Insights</CardTitle>
          <CardDescription className="text-blue-200">
            The power of consistency
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <p>
            Developing good habits is key to achieving your long-term goals. Here&apos;s why consistency matters:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>It takes an average of 66 days to form a new habit.</li>
            <li>Consistent habits lead to compound growth over time.</li>
            <li>Good habits can help automate positive behaviors.</li>
            <li>Tracking your habits increases your chances of sticking to them.</li>
          </ul>
          <p className="mt-4">
            Remember, it&apos;s not about being perfect - it&apos;s about being consistent. Keep up the good work!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitCompleted;