// components/TodaysSuggestedActivities.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface Activity {
  title: string;
  description: string;
}

interface SuggestedActivity {
  id: number;
  userId: string;
  mood: string;
  activities: string;
  createdAt: string;
}

const TodaysSuggestedActivities: React.FC = () => {
  const [activities, setActivities] = useState<SuggestedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaysActivities();
  }, []);

  const fetchTodaysActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-todays-mood-activities');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data: SuggestedActivity[] = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to fetch today\'s activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold">No Activities Available</p>
        <p>There are no suggested activities for today.</p>
      </div>
    );
  }

  const todayActivities = activities[0];
  const parsedActivities: Activity[] = JSON.parse(todayActivities.activities);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-200 to-purple-200 px-6 py-2">
        <h2 className="text-sm font-bold text-black">Today Suggested Activities</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <p>Mood: <span className="font-semibold">{todayActivities.mood}</span></p>
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold mb-2 text-indigo-800">Suggested Activities:</h3>
          <div className="space-y-4">
            {parsedActivities.map((activity: Activity, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-600 mb-1">{activity.title}</h4>
                <p className="text-gray-700">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysSuggestedActivities;