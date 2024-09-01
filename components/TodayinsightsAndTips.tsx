'use client';

import React, { useState, useEffect } from 'react';

interface InsightData {
  id: number;
  userId: string;
  mood: string;
  content: string;
  createdAt: string;
}

interface ParsedContent {
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

const TodaysInsightAndTips: React.FC = () => {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaysInsight();
  }, []);

  const fetchTodaysInsight = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-todays-insights');
      if (!response.ok) {
        throw new Error('Failed to fetch insight');
      }
      const data: InsightData[] = await response.json();
      console.log('Fetched data:', data); // Debug log
      
      // Get the most recent insight
      const mostRecentInsight = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      setInsight(mostRecentInsight);
      setParsedContent(JSON.parse(mostRecentInsight.content));
    } catch (error) {
      console.error('Error fetching insight:', error);
      setError('Failed to fetch today\'s insight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  function getMoodColor(mood: string | null): string {
    if (!mood) return 'bg-gray-500';
    
    switch (mood.toLowerCase()) {
      case 'happy': return 'bg-green-500';
      case 'sad': return 'bg-blue-500';
      case 'angry': return 'bg-red-500';
      case 'anxious': return 'bg-yellow-500';
      case 'tired': return 'bg-gray-500';
      default: return 'bg-purple-500';
    }
  }

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

  if (!insight || !parsedContent) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold">No Insight Available</p>
        <p>There is no insight available for today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
     Today insite and tips
    </div>
  );
};

export default TodaysInsightAndTips;