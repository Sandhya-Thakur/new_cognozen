"use client";
import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const JournalEntryForm: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { isLoaded, userId } = useAuth();

  const saveJournalEntry = async () => {
    if (!isLoaded || !userId) {
      setFeedback({ message: "You must be logged in to save a journal entry.", type: 'error' });
      return;
    }

    if (!journalEntry.trim()) {
      setFeedback({ message: "Journal entry cannot be empty.", type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/upload-journal-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: journalEntry }),
      });

      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }

      const data = await response.json();
      console.log('Journal entry saved:', data.entry);
      setFeedback({ message: "Journal entry saved successfully!", type: 'success' });
      setJournalEntry(''); // Clear the textarea after successful save
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setFeedback({ message: "Failed to save journal entry. Please try again.", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Daily Journal</h2>
      <div className="mb-4">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Write about your day..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
      </div>
      <div className="flex justify-end mb-8">
        <button
          className={`px-6 py-2 rounded-lg text-white font-semibold
            ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'
            }`}
          onClick={saveJournalEntry}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default JournalEntryForm;