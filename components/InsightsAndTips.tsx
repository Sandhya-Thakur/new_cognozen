"use client";
import React, { useState, useEffect } from 'react';

interface InsightData {
  mood: string;
  understanding: {
    title: string;
    description: string;
  };
  impacts: string[];
  strategies: {
    title: string;
    description: string;
  }[];
  conclusion: string;
}

const InsightsAndTips: React.FC = () => {
  const [insights, setInsights] = useState<InsightData | null>(null);
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

  const generateInsights = async () => {
    if (!latestMood) {
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
        body: JSON.stringify({ mood: latestMood }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      console.log("Saved record:", data.savedRecord);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">Insights & Tips</h2>
      <p className="mb-4">Latest Mood: <span className="font-semibold">{latestMood || 'None'}</span></p>
      <button
        onClick={generateInsights}
        disabled={isLoading || !latestMood}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate Insights'}
      </button>
      
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
      
      {insights && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">{insights.understanding.title}</h3>
          <p className="mb-4">{insights.understanding.description}</p>
          
          <h4 className="text-lg font-semibold mb-2">Potential Impacts:</h4>
          <ul className="list-disc pl-5 mb-4">
            {insights.impacts.map((impact, index) => (
              <li key={index}>{impact}</li>
            ))}
          </ul>
          
          <h4 className="text-lg font-semibold mb-2">Strategies:</h4>
          {insights.strategies.map((strategy, index) => (
            <div key={index} className="mb-3">
              <h5 className="font-semibold">{strategy.title}</h5>
              <p>{strategy.description}</p>
            </div>
          ))}
          
          <p className="mt-4 font-semibold">{insights.conclusion}</p>
        </div>
      )}
    </div>
  );
};

export default InsightsAndTips;