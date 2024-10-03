"use client";
import { Header } from "./seeAllEmotionAttentionDataHeader";
import AllAttentionData from "@/components/AllAttentionData"
import AllEmotionsDataDashboard from "@/components/AllEmotionsDataDashboard"
import MoodSummary from "@/components/MoodSummary"
import HabitTrackerDashboard from "@/components/HabitTrackerDashboard"
import GoalsOverviewDashboard from "@/components/GoalsOverviewDashboard"
import WeeklyChallengeStatus from "@/components/WeeklyChallengeStatus"
import PersonalizedInsightsDashboard from "@/components/PersonalizedInsightsDashboard"
import JournalEntriesSummary from "@/components/JournalEntriesSummary"
import GratitudeLog from "@/components/GratitudeLog"
import EmotionalWellbeingGoalsProgress from "@/components/EmotionalWellbeingGoalsProgress"
import AllSuggestedActivities from "@/components/AllSuggestedActivities"
import TodaysPdfAttentionData from "@/components/TodaysPdfAttentionData";
import TodaysPdfEmotionData from "@/components/TodaysPdfEmotionData";
import TodaysQuizAttentionData from "@/components/TodaysQuizAttentionData"
import TodaysQuizEmotionData from "@/components/TodaysQuizEmotionData"
import MoodTrendsData from "@/components/MoodTrendsData";
import DailyMoodComparison from "@/components/MoodComparison";
const AllPdfEmotionAttentionData = () => {
  return (
    <div>
      <Header />
      <AllAttentionData/>
      <AllEmotionsDataDashboard/>
      <MoodSummary/>
      <HabitTrackerDashboard/>
      <GoalsOverviewDashboard/>
      <WeeklyChallengeStatus/>
      <PersonalizedInsightsDashboard/>
      <JournalEntriesSummary/>
      <GratitudeLog/>
      <EmotionalWellbeingGoalsProgress/>
      <AllSuggestedActivities/>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-6">
          <TodaysPdfAttentionData />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TodaysPdfEmotionData />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-6">
          <TodaysQuizAttentionData />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TodaysQuizEmotionData />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-6">
          <MoodTrendsData />
        </div>
        <div className="col-span-12 md:col-span-6">
          <DailyMoodComparison />
        </div>
        </div>



    </div>
  );
};

export default AllPdfEmotionAttentionData;
