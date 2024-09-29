"use client";

import React from "react";
import WelcomeLine from "@/components/WelcomeLine";
import MetricsSection from "@/components/MetricsSection";
import EmotionalWellbeingSection from "@/components/EmotionalWellbeingSection";
import HabitsMetricsSection from "@/components/HabitsMetricsSection";
import LatestActivitySection from "@/components/LatestActivitySection";
import BreatheEaseSection from "@/components/BreatheEaseSection";
import OverallPerformanceSection from "@/components/OverallPerformanceSection";
import DailyProgressSection from "@/components/DailyProgressSection";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-8">
      <WelcomeLine />
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-4">
          <MetricsSection />
          <div className="grid grid-cols-4 gap-2 mt-8">
            <div className="col-span-1">
              <HabitsMetricsSection />
            </div>
            <div className="col-span-3 pl-16">
              <LatestActivitySection />
            </div>
          </div>
          <div className="mt-4">
            <OverallPerformanceSection />
          </div>
        </div>
        <div className="col-span-1 space-y-2">
          <EmotionalWellbeingSection />
          <div className="pt-5">
            <BreatheEaseSection />
            <div className="mt-4 ml-4 pt-4">
            <DailyProgressSection/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}