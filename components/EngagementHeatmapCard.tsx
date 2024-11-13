import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EngagementHeatmapCard: React.FC = () => {
  // This is a simplified heatmap. In a real application, you'd want to generate this data dynamically.
  const heatmapData = [
    [2,1,3,2,1,0,0],
    [3,2,1,2,3,1,0],
    [1,3,2,3,2,1,0],
    [2,1,2,1,1,0,0],
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-2">October</div>
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.flat().map((value, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-sm ${getHeatmapColor(value)}`}
            />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">🏆</span>
            <span>All-Time Built Habits: 1,054</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">🏆</span>
            <span>2024 Built Habits: 98</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">🏆</span>
            <span>All-Time Longest Streak: 114 Days</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">🏆</span>
            <span>2024 Longest Streak: 67 Days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getHeatmapColor = (value: number): string => {
  switch (value) {
    case 0: return 'bg-gray-100';
    case 1: return 'bg-orange-200';
    case 2: return 'bg-orange-300';
    case 3: return 'bg-orange-400';
    default: return 'bg-orange-500';
  }
};

export default EngagementHeatmapCard;