"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TodaysPdfAttentionData from "@/components/TodaysPdfAttentionData";
import TodaysPdfEmotionData from "@/components/TodaysPdfEmotionData";
import TodaysQuizAttentionData from "@/components/TodaysQuizAttentionData"
import TodaysQuizEmotionData from "@/components/TodaysQuizEmotionData"
import MoodTrendsData from "@/components/MoodTrendsData";
import DailyMoodComparison from "@/components/MoodComparison";
import AllsHabits from "@/components/AllHabits";
import HabitCompleted from "@/components/HabitCompleted";
import HabitVisualizationComponent from "@/components/HabitVisualizationComponent";
import MoodHabitCorrelation from "@/components/MoodHabitCorrelation";

interface Habit {
  id: number;
  name: string;
}

export default function Dashboard() {
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
          <Link href="/seeAllEmotionAttentionData" className="text-blue-600 hover:text-blue-800 font-medium">
            See All Data →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DashboardCard title="">
            <MoodTrendsData />
          </DashboardCard>

          <DashboardCard title="">
            <DailyMoodComparison />
          </DashboardCard>

          <DashboardCard title="">
            <TodaysPdfAttentionData />
          </DashboardCard>

          <DashboardCard title="">
            <TodaysPdfEmotionData />
          </DashboardCard>

          <DashboardCard title="">
            <TodaysQuizAttentionData />
          </DashboardCard>

          <DashboardCard title="">
            <TodaysQuizEmotionData />
          </DashboardCard>

          <DashboardCard title="">
            <AllsHabits />
          </DashboardCard>

          <DashboardCard title="">
            <HabitCompleted />
          </DashboardCard>

          <DashboardCard title="">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Habit Completion Heatmap
              </h3>
              <select
                value={selectedHabitId || ""}
                onChange={(e) => setSelectedHabitId(Number(e.target.value))}
                className="mb-4 w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a habit</option>
                {habits.map((habit) => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name}
                  </option>
                ))}
              </select>
              {selectedHabitId && (
                <HabitVisualizationComponent habitId={selectedHabitId} />
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="">
            <MoodHabitCorrelation />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}