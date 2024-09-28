import React from 'react';

const DailyProgressSection: React.FC = () => {
  const dailyProgress = [
    { day: 'Mo', progress: 49 },
    { day: 'Tu', progress: 31 },
    { day: 'We', progress: 77 },
    { day: 'Th', progress: 50 },
    { day: 'Fr', progress: 68 },
    { day: 'Sa', progress: 91 },
    { day: 'Su', progress: 57 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Daily Progress (%)</h2>
      <div className="flex justify-between items-end h-48">
        {dailyProgress.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${day.progress}%` }}>
              <div className="text-xs text-white text-center">{day.progress}</div>
            </div>
            <div className="mt-2 text-sm">{day.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyProgressSection;