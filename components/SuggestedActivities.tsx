"use client";
import React, { useState, useEffect } from 'react';

interface Activity {
  title: string;
  description: string;
}

const SuggestedActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestMood, setLatestMood] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestMood();
  }, []);

  const fetchLatestMood = async () => {
    try {
      const response = await fetch('/api/get-latest-mood');
      if (!response.ok) {
        throw new Error('Failed to fetch latest mood');
      }
      const data = await response.json();
      setLatestMood(data.mood);
    } catch (error) {
      console.error('Error fetching latest mood:', error);
      setError('Failed to fetch latest mood. Please try again.');
    }
  };

  const generateActivities = async () => {
    if (!latestMood) {
      setError("No mood data found. Please log a mood first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setActivities([]);

    try {
      const response = await fetch('/api/generate-suggested-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: latestMood }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities);
      console.log("Saved record:", data.savedRecord);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">Suggested Activities</h2>
      <p className="mb-4">Based on your mood: <span className="font-semibold">{latestMood || 'None'}</span></p>
      <button
        onClick={generateActivities}
        disabled={isLoading || !latestMood}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate Activities'}
      </button>
      
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
      
      {activities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Here are some activities that might help:</h3>
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">{activity.title}</h4>
                <p>{activity.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuggestedActivities;