import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface Activity {
  title: string;
  type: string;
  date: string;
  stage: number;
}

interface ApiError {
  error: string;
  details?: string;
}

const StatusBadge: React.FC<{ stage: number }> = ({ stage }) => {
  let status: string;
  let colorClass: string;

  if (stage === 100) {
    status = 'Completed';
    colorClass = 'bg-green-200 text-green-800';
  } else if (stage > 50) {
    status = 'In Progress';
    colorClass = 'bg-blue-200 text-blue-800';
  } else if (stage > 0) {
    status = 'Started';
    colorClass = 'bg-orange-200 text-orange-800';
  } else {
    status = 'Not Started';
    colorClass = 'bg-gray-200 text-gray-800';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

const LatestActivitySection: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/latest-activities-metrics');
        const data = await response.json();

        if (!response.ok) {
          throw data as ApiError;
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }

        setActivities(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        if (err && typeof err === 'object' && 'error' in err) {
          setError(err as ApiError);
        } else {
          setError({ error: 'An unknown error occurred while fetching activities' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Card className="w-[754px] h-[325px] shadow-md rounded-xl overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {isLoading ? (
          <p>Loading activities...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>Error: {error.error}</p>
            {error.details && <p className="text-sm mt-2">Details: {error.details}</p>}
            <p className="text-sm mt-2">Please check the console and server logs for more information.</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto flex-grow">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="w-1/3">
                    <h3 className="font-medium text-lg">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.type}</p>
                  </div>
                  <div className="w-1/3 text-right">
                    <p className="text-sm text-gray-700">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <div className="w-1/3 flex justify-end">
                    <StatusBadge stage={activity.stage} />
                  </div>
                </div>
              ))
            ) : (
              <p>No activities found.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default LatestActivitySection;