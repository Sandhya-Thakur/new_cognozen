'use client';

import React, { useState, useEffect } from 'react';

interface Strategy {
  title: string;
  description: string;
}

interface InsightData {
  mood: string;
  understanding: {
    title: string;
    description: string;
  };
  impacts: string[];
  strategies: Strategy[];
  conclusion: string;
}

interface MoodData {
  mood: string;
  reasons: string[] | null;
  intensity: number;
  timestamp: string;
}

const InsightsAndTips: React.FC = () => {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [lastInsights, setLastInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestMoodData, setLatestMoodData] = useState<MoodData | null>(null);
  const [showLastInsights, setShowLastInsights] = useState(true);

  useEffect(() => {
    fetchLatestMoodData();
    fetchLastInsights();
  }, []);

  const fetchLatestMoodData = async () => {
    try {
      const response = await fetch('/api/get-latest-mood');
      if (!response.ok) {
        throw new Error('Failed to fetch latest mood data');
      }
      const data = await response.json();
      if (data.mood) {
        setLatestMoodData(data);
      } else {
        setLatestMoodData(null);
      }
    } catch (error) {
      console.error('Error fetching latest mood data:', error);
      setError('Failed to fetch latest mood data. Please try again.');
    }
  };

  const fetchLastInsights = async () => {
    try {
      const response = await fetch('/api/get-last-insights');
      if (!response.ok) {
        throw new Error('Failed to fetch last insights');
      }
      const data = await response.json();
      setLastInsights(data.insights);
    } catch (error) {
      console.error('Error fetching last insights:', error);
      setError('Failed to fetch last insights. Please try again.');
    }
  };

  const generateInsights = async () => {
    if (!latestMoodData) {
      setError("No mood data found. Please log a mood first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setInsights(null);

    try {
      const response = await fetch('/api/generate-insights-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(latestMoodData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      setShowLastInsights(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInsights = (insightData: InsightData) => (
    <div className="mt-6 space-y-6">
      <div className="bg-indigo-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2 text-indigo-800">{insightData.understanding.title}</h3>
        <p className="text-gray-700">{insightData.understanding.description}</p>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2 text-indigo-800">Potential Impacts:</h4>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          {insightData.impacts.map((impact, index) => (
            <li key={index} className="text-gray-700">{impact}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2 text-indigo-800">Strategies:</h4>
        <div className="space-y-3">
          {insightData.strategies.map((strategy, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-indigo-600 mb-1">{strategy.title}</h5>
              <p className="text-gray-700">{strategy.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <p className="font-semibold text-green-800">{insightData.conclusion}</p>
      </div>
    </div>
  );

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">Insights & Tips</h2>
      {latestMoodData && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${getMoodColor(latestMoodData.mood)}`}></div>
            <p>Latest Mood: <span className="font-semibold">{latestMoodData.mood}</span></p>
          </div>
          <p>Intensity: <span className="font-semibold">{latestMoodData.intensity}</span></p>
          <p>Reasons: {latestMoodData.reasons ? latestMoodData.reasons.join(", ") : "No specific reasons provided"}</p>
          <p>Timestamp: {new Date(latestMoodData.timestamp).toLocaleString()}</p>
        </div>
      )}
      <button
        onClick={generateInsights}
        disabled={isLoading || !latestMoodData}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Insights'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {insights && renderInsights(insights)}

      {showLastInsights && !insights && lastInsights && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-indigo-800">Last Generated Insights</h3>
          {renderInsights(lastInsights)}
        </div>
      )}
    </div>
  );
};

function getMoodColor(mood: string): string {
  switch (mood.toLowerCase()) {
    case 'happy': return 'bg-green-500';
    case 'sad': return 'bg-blue-500';
    case 'angry': return 'bg-red-500';
    case 'anxious': return 'bg-yellow-500';
    case 'tired': return 'bg-gray-500';
    default: return 'bg-purple-500';
  }
}

export default InsightsAndTips;