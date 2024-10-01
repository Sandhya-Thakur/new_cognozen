"use client";
import React, { useState, useEffect } from "react";
import LastGeneratedActivities from "./LastGeneratedActivities";

interface Activity {
  title: string;
  description: string;
}

const SuggestedActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestMood, setLatestMood] = useState<string | null>(null);
  const [showLastActivities, setShowLastActivities] = useState(true);

  useEffect(() => {
    fetchLatestMood();
  }, []);

  const fetchLatestMood = async () => {
    try {
      const response = await fetch("/api/get-latest-mood");
      if (!response.ok) {
        throw new Error("Failed to fetch latest mood");
      }
      const data = await response.json();
      setLatestMood(data.mood);
    } catch (error) {
      console.error("Error fetching latest mood:", error);
      setError("Failed to fetch latest mood. Please try again.");
    }
  };

  const generateActivities = async () => {
    if (!latestMood) {
      setError("No mood data found. Please log a mood first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setActivities([]);

    try {
      const response = await fetch("/api/generate-suggested-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood: latestMood }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch activities");
      }

      setActivities(data.activities);
      setShowLastActivities(false); // Hide last activities when new ones are generated
      console.log("Saved record:", data.savedRecord);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to generate activities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="bg-yellow-100 p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold mb-2 text-indigo-800">MoodBooster</h2>
        <div className="flex items-center">
          <span className="text-3xl mr-2">😌</span>
          <span className="text-lg font-semibold text-yellow-600">
            {latestMood || "Calm"}
          </span>
        </div>
        <p className="text-gray-600 mt-2">
          Based on your latest mood check-in, we've curated a list of activities
          designed to either uplift or sustain your current state. Choose one to
          start feeling even better, or perhaps shift your mood towards
          positivity.
        </p>
      </div>

      <button
        onClick={generateActivities}
        disabled={isLoading || !latestMood}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
      >
        {isLoading ? "Generating..." : "Generate Activities"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {activities.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-b-lg">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800">
            Personalized MoodBoosters
          </h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-indigo-700 mb-2">
                  {activity.title}
                </h4>
                <p className="text-gray-700">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLastActivities && activities.length === 0 && (
        <LastGeneratedActivities onNewActivitiesGenerated={() => setShowLastActivities(false)} />
      )}
    </div>
  );
};

export default SuggestedActivities;