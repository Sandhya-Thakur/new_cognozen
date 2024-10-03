"use client";

import React from "react";
import WelcomeLine from "@/components/WelcomeLine";
import MetricsSection from "@/components/MetricsSection";
import HabitsMetricsSection from "@/components/HabitsMetricsSection";
import LatestActivitySection from "@/components/LatestActivitySection";
import BreatheEaseSection from "@/components/BreatheEaseSection";
import OverallPerformanceSection from "@/components/OverallPerformanceSection";
import DailyProgressSection from "@/components/DailyProgressSection";

export default function Dashboard() {
  return (
    <div className="px-8">
      <div>
        <WelcomeLine />
      </div>
      <div>
        <MetricsSection />
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-3">
          <HabitsMetricsSection/>
        </div>
        <div className="col-span-12 md:col-span-5">
          <LatestActivitySection/>
        </div>
        <div className="p-2 col-span-12 md:col-span-3 md:col-start-10 lg:col-start-10 ml-16">
          <BreatheEaseSection/>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-10">
          <OverallPerformanceSection />
        </div>
        <div className="col-span-12 md:col-span-2">
          <DailyProgressSection />
        </div>
      </div>
      </div>
  );
}