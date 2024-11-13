"use client";
import React, { useState, useEffect } from "react";
import HabitCreationWizard from "@/components/HabitCreationWizard";
import AllsHabits from "@/components/AllHabits";
import ManualHabitCompletion from "@/components/ManualHabitCompletion";
import HabitInsightsComponent from "@/components/HabitInsightsComponent";
import HabitTrackerWelcomeLine from "@/components/HabitTrackerWelcomeLine";
import HabitTrackerMetricSection from "@/components/HabitTrackerMetricSection";
import HabitPerformanceChart from "@/components/HabitPerformanceChart";
import TodayProgressCard from "@/components/TodayProgressCard";
import EngagementHeatmapCard from "@/components/EngagementHeatmapCard";
import AllHabitscards from "@/components/AllHabitscards";

export default function HabitsTrackerPage() {
  return (
    <div className="px-8">
      <div>
        <HabitTrackerWelcomeLine />
      </div>
      <div>
        <HabitTrackerMetricSection />
      </div>
      <div className="grid grid-cols-12 gap-2 mt-4">
        <div className="col-span-12 md:col-span-10 space-y-4">
          <HabitPerformanceChart />
          <AllHabitscards />
        </div>
        <div className="col-span-12 md:col-span-2 space-y-4">
          <TodayProgressCard />
          <EngagementHeatmapCard />
        </div>
      </div>
    </div>
  );
}
