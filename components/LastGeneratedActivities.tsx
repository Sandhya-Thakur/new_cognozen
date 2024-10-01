import React, { useState, useEffect } from 'react';

interface Activity {
  title: string;
  description: string;
}

interface LastActivitiesProps {
  onNewActivitiesGenerated: () => void;
}

const LastGeneratedActivities: React.FC<LastActivitiesProps> = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mood, setMood] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLastActivities();
  }, []);

  const fetchLastActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/get-last-activities');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities);
      setMood(data.mood);
      setCreatedAt(new Date(data.createdAt).toLocaleString());
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch last activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (activities.length === 0) return null;

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2 text-indigo-800">Last Generated Activities</h3>
      <p className="text-gray-600 mb-4">
        For mood: <span className="font-semibold">{mood}</span> (Generated on: {createdAt})
      </p>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-semibold text-indigo-700">{activity.title}</h4>
            <p className="text-gray-700">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastGeneratedActivities;