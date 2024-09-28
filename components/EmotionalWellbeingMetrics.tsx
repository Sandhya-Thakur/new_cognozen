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
          throw new Error("Failed to fetch emotional wellbeing data");
        }
        const data = await response.json();
        setWellbeingData(data);
      } catch (error) {
        console.error("Error fetching emotional wellbeing data:", error);
        setError("Failed to load emotional wellbeing data");
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
    <div className="flex items-center justify-between h-full">
      <div className="relative w-20 h-20"> {/* Slightly reduced size */}
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isPositive ? "#4ade80" : "#ef4444"} />
              <stop offset="100%" stopColor={isPositive ? "#facc15" : "#f87171"} />
            </linearGradient>
          </defs>
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E5E7EB" strokeWidth="5" />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeDasharray={`${progress * 1.005}, 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{isPositive ? '+' : '-'}{progress.toFixed(0)}%</span>
        </div>
      </div>
      <div className="ml-4 flex-grow"> {/* Increased margin-left */}
        <h3 className="text-sm text-gray-500">Today vs Yesterday</h3>
        <p className="text-base font-semibold mt-1">Emotional Wellbeing</p>
      </div>
    </div>
  );
};

export default EmotionalWellbeingMetrics;