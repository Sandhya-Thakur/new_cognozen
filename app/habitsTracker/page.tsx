"use client";
import React, { useState, useEffect } from "react";
import HabitCreationWizard from "@/components/HabitCreationWizard";
import AllsHabits from "@/components/AllHabits";
import Link from "next/link";
import ManualHabitCompletion from "@/components/ManualHabitCompletion";
import HabitInsightsComponent from "@/components/HabitInsightsComponent";

interface Habit {
  id: number;
  name: string;
}

export default function HabitsTrackerPage() {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Habits Tracker</h1>
          <p className="mt-2 text-blue-100">
            Build better habits, achieve your goals
          </p>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowCreationWizard(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create New Habit
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <div className="lg:col-span-2 space-y-8">
            <AllsHabits />
            <div className="mt-8">
              <ManualHabitCompletion />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
              <HabitInsightsComponent />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Habit Journal
            </h3>
            {/* TODO: Implement HabitJournalComponent */}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Community Challenges
          </h3>
          {/* TODO: Implement CommunitySocialComponent */}
        </div>
      </main>

      {showCreationWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <HabitCreationWizard onClose={() => setShowCreationWizard(false)} />
        </div>
      )}

      <footer className="flex flex-col items-center p-4 mt-8">
        <div className="mb-4">
          <button className="bg-indigo-500 text-white py-2 px-2 rounded-xl hover:bg-indigo-300 transition-all duration-300">
            <Link href="/emotionsTracker">back</Link>
          </button>
        </div>
        <div>
          <button className="bg-indigo-500 text-white py-2 px-2 rounded-xl hover:bg-indigo-300 transition-all duration-300">
            <Link href="/dashboard">next</Link>
          </button>
        </div>
      </footer>
    </div>
  );
}
