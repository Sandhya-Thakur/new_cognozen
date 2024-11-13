import React from "react";
import HabitProgressCard from "./HabitProgressCard";
import HabitStreakCard from "@/components/HabitStreakCard";
import HabitReminderCard from "@/components/HabitReminderCard";
import DailyRecommendationCard from "@/components/DailyRecommendationCard";
import TimerCard from "@/components/TimerCard";

const HabitTrackerMetricSection: React.FC = () => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <HabitProgressCard />
        <HabitStreakCard/>
        <HabitReminderCard/>
        <DailyRecommendationCard/>
        <TimerCard/>
      </div>
    </div>
  );
};

export default HabitTrackerMetricSection;
