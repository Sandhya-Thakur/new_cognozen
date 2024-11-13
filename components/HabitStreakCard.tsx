import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface HabitStreak {
  id: number;
  name: string;
  streakDays: number;
  frequency: "daily" | "weekly" | "monthly";
}

interface HabitMotivation {
  id: number;
  name: string;
  motivationalLine: string;
}

const HabitStreakCard: React.FC = () => {
  const [habitStreaks, setHabitStreaks] = useState<HabitStreak[]>([]);
  const [habitMotivations, setHabitMotivations] = useState<HabitMotivation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMotivationIndex, setCurrentMotivationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streakResponse, motivationResponse] = await Promise.all([
          fetch("/api/habits/streak"),
          fetch("/api/habits/habit-motivation"),
        ]);

        if (!streakResponse.ok || !motivationResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const streakData = await streakResponse.json();
        const motivationData = await motivationResponse.json();

        setHabitStreaks(streakData.habitStreaks || []);
        setHabitMotivations(motivationData.habitMotivations || []);
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (habitMotivations.length > 0) {
      const changeMotivation = () => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentMotivationIndex(
            (prevIndex) => (prevIndex + 1) % habitMotivations.length
          );
          setIsVisible(true);
        }, 500);
      };

      const interval = setInterval(changeMotivation, 3600000);
      changeMotivation();

      return () => clearInterval(interval);
    }
  }, [habitMotivations]);

  const getStreakText = (streak?: HabitStreak): { number: string; unit: string } => {
    if (!streak) {
      return { number: "0", unit: "Days" };
    }

    switch (streak.frequency) {
      case "daily":
        return {
          number: streak.streakDays.toString(),
          unit: `Consecutive Day${streak.streakDays !== 1 ? "s" : ""}`
        };
      case "weekly":
        const weeks = Math.floor(streak.streakDays / 7);
        return {
          number: weeks.toString(),
          unit: `Consecutive Week${weeks !== 1 ? "s" : ""}`
        };
      case "monthly":
        const months = Math.floor(streak.streakDays / 30);
        return {
          number: months.toString(),
          unit: `Consecutive Month${months !== 1 ? "s" : ""}`
        };
      default:
        return { number: "0", unit: "Days" };
    }
  };

  if (loading) {
    return (
      <Card className="bg-blue-500 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-blue-400 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-blue-400 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-blue-400 rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-500 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-6">
          <p>Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const topStreak = habitStreaks.length > 0
    ? habitStreaks.reduce((max, habit) =>
        habit.streakDays > max.streakDays ? habit : max
      )
    : undefined;

  const streakText = getStreakText(topStreak);
  const currentMotivation = habitMotivations[currentMotivationIndex];

  return (
    <Card className="bg-blue-500 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        {topStreak && topStreak.streakDays > 0 && (
          <div className="bg-green-400 text-green-800 text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
            New Record Achieved!
          </div>
        )}
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-4xl font-bold">{streakText.number}</span>
          <span className="text-xl">{streakText.unit}</span>
          <Flame className="w-6 h-6 text-yellow-400" />
        </div>
        <p
          className={`text-l opacity-90 min-h-[3em] pt-2 transition-opacity duration-500 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentMotivation
            ? `${currentMotivation.name}: ${currentMotivation.motivationalLine}`
            : "Stay motivated!"}
        </p>
      </CardContent>
    </Card>
  );
};

export default HabitStreakCard;