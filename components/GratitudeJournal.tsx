"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface GratitudeEntry {
  id: number;
  content: string;
  createdAt: string;
}

const GratitudeJournal: React.FC = () => {
  const [gratitudeEntry, setGratitudeEntry] = useState("");
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
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
      setFeedback({
        message: "Failed to load gratitude entries. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveGratitudeEntry = async () => {
    if (!isLoaded || !userId) {
      setFeedback({
        message: "You must be logged in to save a gratitude entry.",
        type: "error",
      });
      return;
    }

    if (!gratitudeEntry.trim()) {
      setFeedback({
        message: "Gratitude entry cannot be empty.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/upload-gratitude-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: gratitudeEntry }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Gratitude entry saved:", data.entry);
      setFeedback({
        message: "Gratitude entry saved successfully!",
        type: "success",
      });
      setGratitudeEntry(""); // Clear the textarea after successful save
      fetchGratitudeEntries(); // Refresh the list of entries
    } catch (error) {
      console.error("Detailed fetch error:", error);
      setFeedback({
        message: `Failed to save gratitude entry: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Gratitude Journal
      </h2>
      <div className="mb-4">
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="What are you grateful for today?"
          value={gratitudeEntry}
          onChange={(e) => setGratitudeEntry(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
      </div>
      <div className="flex justify-end mb-8">
        <button
          className={`px-6 py-2 rounded-lg text-white font-semibold
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            }`}
          onClick={saveGratitudeEntry}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </button>
      </div>
      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            feedback.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}
      
      {/* Gratitude Entries List */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Your Gratitude Entries</h3>
        {isLoading ? (
          <p>Loading gratitude entries...</p>
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
    </div>
  );
};

export default GratitudeJournal;