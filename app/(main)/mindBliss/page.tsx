"use client";
import React, { useState, useEffect } from "react";
import TodaysPdfAttentionData from "@/components/TodaysPdfAttentionData";
import TodaysPdfEmotionData from "@/components/TodaysPdfEmotionData";
import TodaysQuizAttentionData from "@/components/TodaysQuizAttentionData"
import TodaysQuizEmotionData from "@/components/TodaysQuizEmotionData"
import MoodTrendsData from "@/components/MoodTrendsData";
import DailyMoodComparison from "@/components/MoodComparison";
import HabitVisualizationComponent from "@/components/HabitVisualizationComponent";
import MoodHabitCorrelation from "@/components/MoodHabitCorrelation";
import AllsHabits from "@/components/AllHabits";
import ManualHabitCompletion from "@/components/ManualHabitCompletion";
import HabitInsightsComponent from "@/components/HabitInsightsComponent";
import HabitCreationWizard from "@/components/HabitCreationWizard";

interface Habit {
  id: number;
  name: string;
}
export default function MindBliss() {
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits/all");
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits);
        if (data.habits.length > 0) {
          setSelectedHabitId(data.habits[0].id);
        }
      } else {
        console.error("Failed to fetch habits");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-[#0F52BA] text-white py-8 rounded-b-3xl shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold">Habits Tracker</h1>
          <p className="mt-2 text-xl text-blue-100">
            Build better habits, achieve your goals
          </p>
        </div>
      </header>

      <main className="container mx-auto mt-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setShowCreationWizard(true)}
            className="bg-[#0F52BA] hover:bg-[#0D47A1] text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:ring-opacity-50 shadow-md"
          >
            Create New Habit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition duration-300">
              <AllsHabits />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition duration-300">
              <ManualHabitCompletion />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition duration-300">
              <HabitInsightsComponent />
            </div>
          </div>
        </div>

      </main>

      {showCreationWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <HabitCreationWizard onClose={() => setShowCreationWizard(false)} />
        </div>
      )}

      <footer className="flex justify-center space-x-4 p-8 mt-12">
      </footer>
    </div>
  );
}




