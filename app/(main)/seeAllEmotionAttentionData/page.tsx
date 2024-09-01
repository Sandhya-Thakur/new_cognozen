"use client";
import { Header } from "./seeAllEmotionAttentionDataHeader";
import AttentionEmotionsDataDashboard from "@/components/AllAttentionData"
import AllEmotionsDataDashboard from "@/components/AllEmotionsDataDashboard"
import MoodSummary from "@/components/MoodSummary"

const AllPdfEmotionAttentionData = () => {
  return (
    <div>
      <Header />
      <AttentionEmotionsDataDashboard/>
      <AllEmotionsDataDashboard/>
      <MoodSummary/>

    </div>
  );
};

export default AllPdfEmotionAttentionData;
