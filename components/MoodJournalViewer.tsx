"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface JournalEntry {
  id: number;
  content: string;
  createdAt: string;
  mood?: string;
}

const JournalViewer: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchJournalEntries();
    }
  }, [isLoaded, userId]);

  const fetchJournalEntries = async () => {
    try {
      const response = await fetch('/api/get-journal-data');
      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }
      const data = await response.json();
      setJournalEntries(data.entries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setError("Failed to load journal entries. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Journal Entries</h1>
        {isLoading ? (
          <p className="text-center text-gray-600">Loading journal entries...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : journalEntries.length > 0 ? (
          <ul className="space-y-6">
            {journalEntries.map((entry) => (
              <li key={entry.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {new Date(entry.createdAt).toLocaleDateString()} 
                    {entry.mood && <span className="ml-2 text-sm text-gray-500">Mood: {entry.mood}</span>}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Entry</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {entry.content}
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No journal entries yet. Start writing to see your entries here!</p>
        )}
      </div>
    </div>
  );
};

export default JournalViewer;