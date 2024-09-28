import React from 'react';
import { Card } from '@/components/ui/card';

interface Activity {
  title: string;
  type: string;
  date: string;
  stage: number;
}

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = percentage === 100 ? '#22C55E' : '#FDE047';

  return (
    <div className="relative w-8 h-8 inline-flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <circle
          className="text-gray-200"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r="10"
          cx="12"
          cy="12"
        />
        <circle
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="transparent"
          r="10"
          cx="12"
          cy="12"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease 0s',
          }}
        />
      </svg>
    </div>
  );
};

const LatestActivitySection: React.FC = () => {
  const activities: Activity[] = [
    { title: "Climate & Environment Study", type: "Reading", date: "09/21/2024", stage: 98 },
    { title: "Beyond Science", type: "Flashcards", date: "09/21/2024", stage: 57 },
    { title: "Political Science Test", type: "Quiz", date: "09/21/2024", stage: 92 },
    { title: "Political Science Report", type: "Reading", date: "09/21/2024", stage: 100 },
  ];

  return (
    <Card className="w-[70%] ml-16 shadow-md rounded-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Latest Activity</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-4 font-medium">Title</th>
              <th className="pb-4 font-medium">Type</th>
              <th className="pb-4 font-medium">Date</th>
              <th className="pb-4 font-medium text-right">Stage</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-4 pr-4">
                  <span className="text-gray-700 font-medium">{activity.title}</span>
                </td>
                <td className="py-4 pr-4 text-gray-500">{activity.type}</td>
                <td className="py-4 pr-4 text-gray-500">{activity.date}</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end">
                    <span className="mr-2 text-gray-700 font-medium">{activity.stage}%</span>
                    <CircularProgress percentage={activity.stage} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LatestActivitySection;