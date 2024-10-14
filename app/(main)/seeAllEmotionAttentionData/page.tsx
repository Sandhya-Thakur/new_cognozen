"use client";

import { Header } from "./seeAllEmotionAttentionDataHeader";
import AllAttentionData from "@/components/AllAttentionData";
import AllEmotionsDataDashboard from "@/components/AllEmotionsDataDashboard";
import MoodSummary from "@/components/MoodSummary";
import HabitTrackerDashboard from "@/components/HabitTrackerDashboard";
import GoalsOverviewDashboard from "@/components/GoalsOverviewDashboard";
import WeeklyChallengeStatus from "@/components/WeeklyChallengeStatus";
import MoodInsightsDashboard from "@/components/MoodInsightsDashboard";
import JournalEntriesSummary from "@/components/JournalEntriesSummary";
import GratitudeLog from "@/components/GratitudeLog";
import AllSuggestedActivities from "@/components/AllSuggestedActivities";
import MoodTrendsData from "@/components/MoodTrendsData";
import DailyMoodComparison from "@/components/MoodComparison";
import MoodBoosterDashboard from "@/components/MoodBoosterDashboard"

const AllPdfEmotionAttentionData = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Comprehensive Dashboard
        </h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Full-width components */}
          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <AllAttentionData />
          </div>
          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <AllEmotionsDataDashboard />
          </div>

          {/* Two-column layout for smaller components */}
          <div className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-6">
            <MoodTrendsData />
          </div>
          <div className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-6">
            <DailyMoodComparison />
          </div>
          <div className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-6">
            <MoodSummary />
          </div>
          <div className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-6">
            <HabitTrackerDashboard />
          </div>
          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <MoodInsightsDashboard />
          </div>
          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <MoodBoosterDashboard />
          </div>

          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <GoalsOverviewDashboard />
          </div>
          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <JournalEntriesSummary />
          </div>
          <div className="col-span-12 bg-white rounded-lg shadow-md p-6">
            <GratitudeLog />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllPdfEmotionAttentionData;
