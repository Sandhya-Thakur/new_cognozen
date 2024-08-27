"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface GratitudeEntry {
  id: number;
  content: string;
  createdAt: string;
}

const GratitudeViewer: React.FC = () => {
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchGratitudeEntries();
    }
  }, [isLoaded, userId]);

  const fetchGratitudeEntries = async () => {
    try {
      const response = await fetch("/api/get-gratitude-data");
      if (!response.ok) {
        throw new Error("Failed to fetch gratitude entries");
      }
      const data = await response.json();
      setGratitudeEntries(data.entries);
    } catch (error) {
      console.error("Error fetching gratitude entries:", error);
      setError("Failed to load gratitude entries. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Your Gratitude Entries
      </h2>
      {isLoading ? (
        <p>Loading gratitude entries...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : gratitudeEntries.length > 0 ? (
        <ul className="space-y-4">
          {gratitudeEntries.map((entry) => (
            <li key={entry.id} className="bg-white shadow rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-2">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
              <p>{entry.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No gratitude entries yet. Start writing to see your entries here!</p>
      )}
    </div>
  );
};

export default GratitudeViewer;