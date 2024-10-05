import React, { useState, useEffect } from 'react';
import { Smile } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || '';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

type Mood = 'happy' | 'sad' | 'angry' | 'excited' | 'calm' | 'anxious' | 'neutral' | 'unknown';

interface MoodResponse {
  mood: Mood;
}

const getMoodEmoji = (mood: Mood | null): string => {
  if (mood === null) return "🤔";
  
  const moodMap: Record<Mood, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    excited: "😃",
    calm: "😌",
    anxious: "😰",
    neutral: "😐",
    unknown: "🤔"
  };
  
  return moodMap[mood.toLowerCase() as Mood] || "🤔";
};

let cachedMood: Mood | null = null;
let lastFetchTime = 0;

const CurrentMood: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMood = async (): Promise<Mood | null> => {
    const now = Date.now();
    if (cachedMood && now - lastFetchTime < CACHE_TIME) {
      return cachedMood;
    }

    try {
      const response = await fetch(`${API_URL}/api/get-latest-mood`, {
        headers: {
          // Include authentication if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mood");
      }

      const data: MoodResponse = await response.json();
      cachedMood = data.mood;
      lastFetchTime = now;
      return cachedMood;
    } catch (error) {
      console.error("Error fetching mood:", error);
      setError("Failed to fetch mood");
      return null;
    }
  };

  useEffect(() => {
    const getMood = async () => {
      setIsLoading(true);
      setError(null);
      const mood = await fetchMood();
      setCurrentMood(mood);
      setIsLoading(false);
    };

    getMood();
  }, []);

  if (error) {
    return (
      <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full ml-2 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full ml-2">
      <div className='mr-4'>
        Current Mood:
      </div>
      <span>{isLoading ? "Loading..." : (currentMood || "Unknown")}</span>
      <span className="ml-2 text-2xl mt-2">
        {isLoading ? <Smile className="animate-spin" /> : getMoodEmoji(currentMood)}
      </span>
    </div>
  );
};

export default CurrentMood;