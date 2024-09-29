import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DailyProgressSection: React.FC = () => {
  const dailyProgress = [
    { day: 'Mo', progress: 49, color: '#3b82f6' }, // Blue
    { day: 'Tu', progress: 31, color: '#ef4444' }, // Red
    { day: 'We', progress: 77, color: '#10b981' }, // Green
    { day: 'Th', progress: 50, color: '#f59e0b' }, // Yellow
    { day: 'Fr', progress: 68, color: '#8b5cf6' }, // Purple
    { day: 'Sa', progress: 91, color: '#ec4899' }, // Pink
    { day: 'Su', progress: 57, color: '#f97316' }, // Orange
  ];

  return (
    <Card className="bg-white rounded-3xl shadow-lg h-[512px]">
      <CardContent>
        <h2 className="text-xl font-bold mb-6">Daily Progress (%)</h2>
        <div className="flex justify-between items-end h-[400px]">
          {dailyProgress.map((day, index) => (
            <div key={index} className="flex flex-col items-center w-1/7">
              <div className="relative w-full bg-gray-200 rounded-full" style={{ height: '100%' }}>
                <div 
                  className="absolute bottom-0 w-full rounded-full transition-all duration-500 ease-in-out"
                  style={{ 
                    height: `${day.progress}%`,
                    backgroundColor: day.color // Inline style for color
                  }}
                >
                  {day.progress > 0 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold">
                      {day.progress}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm font-medium">{day.day}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgressSection;
