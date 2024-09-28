"use client";

import React from "react";
import WelcomeLine from "@/components/WelcomeLine";
import MetricsSection from "@/components/MetricsSection";
import EmotionalWellbeingSection from "@/components/EmotionalWellbeingSection";
import HabitsMetricsSection from "@/components/HabitsMetricsSection";
import LatestActivitySection from '@/components/LatestActivitySection'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4">
      <WelcomeLine />
      <div className="grid grid-cols-5 gap-6 mb-6 mt-6">
        <div className="col-span-4 pl-1">
          <MetricsSection />
        </div>
        <div className="col-span-1">
          <EmotionalWellbeingSection />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-6 mb-6">
        <div className="col-span-1">
          <HabitsMetricsSection />
        </div>
        <div className="col-span-4">
          <LatestActivitySection/>
        </div>
      </div>
    </div>
  );
}