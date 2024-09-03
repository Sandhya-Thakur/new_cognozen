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


    </div>
  );
};

export default AllPdfEmotionAttentionData;
