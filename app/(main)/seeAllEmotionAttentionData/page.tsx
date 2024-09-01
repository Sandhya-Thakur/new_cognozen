"use client";
import { Header } from "./seeAllEmotionAttentionDataHeader";
import AttentionEmotionsDataDashboard from "@/components/AllAttentionData"
import AllEmotionsDataDashboard from "@/components/AllEmotionsDataDashboard"
import MoodSummary from "@/components/MoodSummary"
import HabitTrackerDashboard from "@/components/HabitTrackerDashboard"
import GoalsOverviewDashboard from "@/components/GoalsOverviewDashboard"
import WeeklyChallengeStatus from "@/components/WeeklyChallengeStatus"

const AllPdfEmotionAttentionData = () => {
  return (
    <div>
      <Header />
      <AttentionEmotionsDataDashboard/>
      <AllEmotionsDataDashboard/>
      <MoodSummary/>
      <HabitTrackerDashboard/>
      <GoalsOverviewDashboard/>
      <WeeklyChallengeStatus/>

    </div>
  );
};

export default AllPdfEmotionAttentionData;
