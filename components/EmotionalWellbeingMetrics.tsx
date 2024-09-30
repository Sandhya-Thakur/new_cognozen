import React, { useState, useEffect } from 'react';

interface EmotionalWellbeingData {
  todayScore: number;
  yesterdayScore: number;
  change: number;
}

const EmotionalWellbeingMetrics: React.FC = () => {
  const [wellbeingData, setWellbeingData] = useState<EmotionalWellbeingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWellbeingData = async () => {
      try {
        const response = await fetch("/api/emotional-wellbeing-metrics");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log("Received data:", data); // Log the received data

        // Validate the data
        if (typeof data.todayScore !== 'number' || typeof data.yesterdayScore !== 'number') {
          console.error("Invalid data format:", data);
          throw new Error("Invalid data format: scores must be numbers");
        }
        
        // Calculate the change
        const change = data.yesterdayScore !== 0
          ? ((data.todayScore - data.yesterdayScore) / data.yesterdayScore) * 100
          : 0;
        
        setWellbeingData({
          todayScore: data.todayScore,
          yesterdayScore: data.yesterdayScore,
          change: isNaN(change) ? 0 : change
        });
      } catch (error) {
        console.error("Error fetching emotional wellbeing data:", error);
        if (error instanceof TypeError && error.message.includes("toFixed")) {
          setError("Data format error: Expected number values for scores");
        } else {
          setError(error instanceof Error ? error.message : "Failed to load emotional wellbeing data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWellbeingData();
  }, []);

  if (isLoading) return <div>Loading emotional wellbeing data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!wellbeingData) return null;

  const progress = Math.abs(wellbeingData.change);
  const isPositive = wellbeingData.change >= 0;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 50 50">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isPositive ? "#4ade80" : "#ef4444"} />
              <stop offset="100%" stopColor={isPositive ? "#facc15" : "#f87171"} />
            </linearGradient>
          </defs>
          <circle cx="25" cy="25" r="22" fill="none" stroke="#E5E7EB" strokeWidth="5" />
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="5"
            strokeDasharray={`${progress * 1.38}, 100`}
            strokeLinecap="round"
            transform="rotate(-90 25 25)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{isPositive ? '+' : '-'}{progress.toFixed(0)}%</span>
        </div>
      </div>
      <div className="ml-6 flex-grow">
        <h4 className="text-sm text-gray-500">Today vs Yesterday</h4>
        <p className="text-base font-semibold mt-1">Emotional Wellbeing</p>
      </div>
    </div>
  );
};

export default EmotionalWellbeingMetrics;