"use client";
import React from "react";
import Link from "next/link";
import MoodSelector from "@/components/MoodSelector";
import MoodHistory from "@/components/MoodHistory";
import MoodTrendsData from "@/components/MoodTrendsData";
import MoodComparison from "@/components/MoodComparison";
import JournalComponent from "@/components/SeeJournalComponent";
import GratitudeJournal from "@/components/GratitudeJournal";
import EmotionalWellbeingGoals from "@/components/emotionalWellbeingGoals";
import GuidedBreathingExercise from "@/components/GuidedBreathingExercise";
import InsightsAndTips from "@/components/InsightsAndTips";
import { useState, useEffect } from "react";
import SuggestedActivities from "@/components/SuggestedActivities";
// Define your moods array here or import it from a separate file
const moods = [
  { image: "/happy.png", mood: "Happy", color: "bg-yellow-100" },
  { image: "/sad.png", mood: "Sad", color: "bg-blue-100" },
  { image: "/angry.png", mood: "Angry", color: "bg-red-100" },
  { image: "/sleepy.png", mood: "Tired", color: "bg-purple-100" },
  { image: "/cool.png", mood: "Cool", color: "bg-green-100" },
  { image: "/confused.png", mood: "Confused", color: "bg-orange-100" },
];

export default function EmotionsTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const handleMoodSelect = (mood: string | null) => {
    console.log("Mood selected in EmotionsTrackerPage:", mood);
    setSelectedMood(mood);
  };

  useEffect(() => {
    console.log("selectedMood updated in EmotionsTrackerPage:", selectedMood);
  }, [selectedMood]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 text-white p-4 rounded-b-lg shadow-md">
        <h1 className="text-xl font-bold">How are you feeling Today?</h1>
      </header>

      <main className="flex flex-col items-center p-4 mt-8">
        <MoodSelector moods={moods} onMoodSelect={handleMoodSelect} />
        <div className="mt-12 w-full">
          <MoodHistory />
        </div>
        <div className="mt-12 w-full">
          <MoodTrendsData />
        </div>
        <div className="mt-12 w-full">
          <MoodComparison />
        </div>
        <div className="mt-12 w-full">
          <JournalComponent />
        </div>
        <div className="mt-12 w-full">
          <GratitudeJournal />
        </div>
        <div className="mt-12 w-full">
          <EmotionalWellbeingGoals />
        </div>

        <div className="mt-12 w-full">
          <div>
            <InsightsAndTips />
          </div>
        </div>

        <div className="mt-12 w-full">
          <div>
          <SuggestedActivities />
          </div>
        </div>

        <div className="mt-12 w-full">
          <GuidedBreathingExercise />
        </div>
      </main>

      <footer className="flex flex-col items-center p-4 mt-8">
        <button className="bg-indigo-500 text-white py-4 px-8 rounded-2xl hover:bg-indigo-300 transition-all duration-300">
          <Link href="/dashboard">Continue Learning</Link>
        </button>
      </footer>
    </div>
  );
}
