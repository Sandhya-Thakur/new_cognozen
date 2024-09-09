"use client";

import React, { useState, useEffect } from "react";
import MoodSelector from "@/components/MoodSelector";
import GuidedBreathingExercise from "@/components/GuidedBreathingExercise";
import InsightsAndTips from "@/components/InsightsAndTips";
import SuggestedActivities from "@/components/SuggestedActivities";
import JournalEntryForm from "@/components/JournalEntryForm";
import GratitudeEntryForm from "@/components/GratitudeEntryForm";
import GoalEntryForm from "@/components/GoalEntryForm";

// Define your moods array here or import it from a separate file
const moods = [
  { image: "/happy.png", mood: "Happy", color: "bg-[#E3F2FD]" },
  { image: "/sad.png", mood: "Sad", color: "bg-[#BBDEFB]" },
  { image: "/angry.png", mood: "Upset", color: "bg-[#90CAF9]" },
  { image: "/sleepy.png", mood: "Tired", color: "bg-[#64B5F6]" },
  { image: "/cool.png", mood: "Calm", color: "bg-[#42A5F5]" },
  { image: "/confused.png", mood: "Unsure", color: "bg-[#2196F3]" },
];

export default function EmotionsTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  const handleMoodSelect = (mood: string | null) => {
    console.log("Mood selected in EmotionsTrackerPage:", mood);
    setSelectedMood(mood);
  };

  useEffect(() => {
    console.log("selectedMood updated in EmotionsTrackerPage:", selectedMood);
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, [selectedMood]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-[#0F52BA] text-white p-6 rounded-b-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl">{currentDate}</p>
          </div>
        </div>
        <p className="mt-2 text-lg">Track your emotions and improve your well-being</p>
      </header>

      <main className="flex flex-col items-center p-4 mt-8">
        <MoodSelector moods={moods} onMoodSelect={handleMoodSelect} />

        <div className="mt-12 w-full max-w-3xl">
          <JournalEntryForm />
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <GratitudeEntryForm />
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <GoalEntryForm />
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <InsightsAndTips />
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <SuggestedActivities />
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <GuidedBreathingExercise />
        </div>
      </main>

      <footer className="flex flex-col items-center p-4 mt-8 mb-8">
      </footer>
    </div>
  );
}