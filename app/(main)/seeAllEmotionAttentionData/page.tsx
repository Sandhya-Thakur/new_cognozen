"use client";
import { Header } from "./seeAllEmotionAttentionDataHeader";
import AttentionEmotionsDataDashboard from "@/components/AllAttentionData"
import AllEmotionsDataDashboard from "@/components/AllEmotionsDataDashboard"

const AllPdfEmotionAttentionData = () => {
  return (
    <div>
      <Header />
      <AttentionEmotionsDataDashboard/>
      <AllEmotionsDataDashboard/>

    </div>
  );
};

export default AllPdfEmotionAttentionData;
