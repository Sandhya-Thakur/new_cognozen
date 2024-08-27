// components/HabitVisualizationComponent.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { subDays, eachDayOfInterval, format, parseISO, isSameDay } from 'date-fns';
import { toast } from 'react-hot-toast';

interface HabitCompletion {
  completedDate: string;
  value: number;
}

interface HabitVisualizationComponentProps {
  habitId: number;
}

const HabitVisualizationComponent: React.FC<HabitVisualizationComponentProps> = ({ habitId }) => {
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompletions();
  }, [habitId]);

  const fetchCompletions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/habits/completions?habitId=${habitId}&days=365`);
      if (!response.ok) {
        throw new Error('Failed to fetch habit completions');
      }
      const data = await response.json();
      setCompletions(data.completions);
    } catch (error) {
      console.error('Error fetching habit completions:', error);
      toast.error('Failed to load habit completions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getColor = (value: number) => {
    if (value === 0) return '#ebedf0';
    if (value === 1) return '#c6e48b';
    if (value === 2) return '#7bc96f';
    if (value === 3) return '#239a3b';
    return '#196127';
  };

  if (isLoading) return <div className="text-center py-4">Loading visualization...</div>;

  const today = new Date();
  const startDate = subDays(today, 365);
  const dateRange = eachDayOfInterval({ start: startDate, end: today });

  const weeks = [];
  for (let i = 0; i < dateRange.length; i += 7) {
    weeks.push(dateRange.slice(i, i + 7));
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <div className="grid grid-cols-[auto_repeat(53,1fr)] gap-1">
        {['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <div key={day} className="text-xs text-gray-400 text-center">
            {index === 0 ? '' : day}
          </div>
        ))}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {weekIndex % 4 === 0 && (
              <div className="text-xs text-gray-400 pr-2 text-right">
                {format(week[0], 'MMM')}
              </div>
            )}
            {week.map((date, dayIndex) => {
              const completion = completions.find(c => 
                isSameDay(parseISO(c.completedDate), date)
              );
              const value = completion ? completion.value : 0;
              return (
                <div
                  key={date.toISOString()}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${format(date, 'MMM dd, yyyy')}: ${value} completion${value !== 1 ? 's' : ''}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColor(level) }}
            />
          ))}
          <span className="text-sm text-gray-600">More</span>
        </div>
      </div>
    </div>
  );
};

export default HabitVisualizationComponent;