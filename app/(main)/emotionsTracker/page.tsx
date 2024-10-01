"use client";

import React, { useState, useEffect } from "react";
import MoodSelector from "@/components/MoodSelector";
import WelcomeLine from "@/components/WelcomeLine";
import { Toaster } from "@/components/ui/toaster";
import FeelFlowBreathingExercise from "@/components/FeelFlowBreatingExercise";
import FeeFlowTrend from "@/components/FeeFlowTrend";

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
    <div className="min-h-screen">
      <WelcomeLine />
      <div
        className="absolute"
        style={{
          width: '492px',
          height: '453px',
          top: '158px',
          left: '100px',
          padding: '30px 0px 0px 0px',
          borderRadius: '8px 0px 0px 0px',
        }}
      >
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>
      <div
        className="absolute"
        style={{
          width: '264px',
          height: '440px',
          top: '730px',
          left: '100px',
          padding: '30px 0px 0px 0px',
          gap: '15px',
          borderRadius: '8px 0px 0px 0px',
        }}
      >
        <FeelFlowBreathingExercise />
      </div>
      <div
        className="absolute"
        style={{
          width: '240px',
          height: '387px',
          top: '730px',
          left: '360px',
          padding: '30px 0px 0px 0px',
          gap: '15px',
          borderRadius: '8px 0px 0px 0px',
        }}
      >
        <FeeFlowTrend />
      </div>
      <Toaster />
    </div>
  );
}