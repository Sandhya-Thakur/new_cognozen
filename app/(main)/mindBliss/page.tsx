"use client";

import TodaysPdfAttentionData from "@/components/TodaysPdfAttentionData";
import TodaysPdfEmotionData from "@/components/TodaysPdfEmotionData";
import TodaysQuizAttentionData from "@/components/TodaysQuizAttentionData"
import TodaysQuizEmotionData from "@/components/TodaysQuizEmotionData"
import MoodTrendsData from "@/components/MoodTrendsData";
import DailyMoodComparison from "@/components/MoodComparison";
import HabitVisualizationComponent from "@/components/HabitVisualizationComponent";
import MoodHabitCorrelation from "@/components/MoodHabitCorrelation";
export default function MindBliss() {
  return (
    <div>
      <TodaysPdfAttentionData/>
      <TodaysPdfEmotionData/>
      <TodaysQuizAttentionData/>
      <TodaysQuizEmotionData/>

    </div>
  )
}