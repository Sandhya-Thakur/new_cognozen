import React, { useState, useEffect, useRef } from "react";
import { Smile, Calendar, Target, Bell, X } from "lucide-react";

interface Habit {
  id: number;
  name: string;
}

interface HabitCompletion {
  habitId: number;
  completedAt: string;
  value: number;
}

const IncompleteHabitsList: React.FC<{
  habits: Habit[];
  onClose: () => void;
}> = ({ habits, onClose }) => (
  <div className="absolute right-0 mt-2 w-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md shadow-lg z-10 text-white">
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Incomplete Habits</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
      <ul className="space-y-2">
        {habits.map((habit) => (
          <li key={habit.id} className="flex items-center">
            <Target size={16} className="mr-2 text-red-300" />
            <span>{habit.name}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const Header: React.FC = () => {
  const [timeRange, setTimeRange] = useState("Today");
  const [currentMood, setCurrentMood] = useState<string | null>("Loading...");
  const [streakData, setStreakData] = useState({ streak: 0, habitName: "" });
  const [upcomingGoals, setUpcomingGoals] = useState(0);
  const [habitData, setHabitData] = useState({ completed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showIncompleteHabits, setShowIncompleteHabits] = useState(false);
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const incompleteHabitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchLatestMood(),
        fetchStreakData(),
        fetchUpcomingGoals(),
        fetchHabitsAndCompletions(),
      ]);
      setIsLoading(false);
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        incompleteHabitsRef.current &&
        !incompleteHabitsRef.current.contains(event.target as Node)
      ) {
        setShowIncompleteHabits(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLatestMood = async () => {
    try {
      const response = await fetch("/api/get-latest-mood");
      if (!response.ok) {
        throw new Error("Failed to fetch mood");
      }
      const data = await response.json();
      setCurrentMood(data.mood);
    } catch (error) {
      console.error("Error fetching mood:", error);
      setCurrentMood("Unknown");
    }
  };

  const fetchStreakData = async () => {
    try {
      const response = await fetch("/api/get-current-streak");
      if (!response.ok) {
        throw new Error("Failed to fetch streak data");
      }
      const data = await response.json();
      setStreakData({ streak: data.streak, habitName: data.habitName });
    } catch (error) {
      console.error("Error fetching streak data:", error);
      setStreakData({ streak: 0, habitName: "Unknown" });
    }
  };

  const fetchUpcomingGoals = async () => {
    try {
      const response = await fetch("/api/get-upcoming-goals");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming goals");
      }
      const data = await response.json();
      setUpcomingGoals(data.upcomingGoals);
    } catch (error) {
      console.error("Error fetching upcoming goals:", error);
      setUpcomingGoals(0);
    }
  };

  const fetchHabitsAndCompletions = async () => {
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        fetch("/api/habits/all"),
        fetch("/api/habits/today-completion"),
      ]);

      if (habitsResponse.ok && completionsResponse.ok) {
        const habitsData = await habitsResponse.json();
        const completionsData = await completionsResponse.json();

        const habits: Habit[] = habitsData.habits;
        const habitCompletions: HabitCompletion[] = completionsData.completions;

        setAllHabits(habits);
        setCompletions(habitCompletions);

        const totalHabits = habits.length;
        const completedHabits = habitCompletions.length;

        setHabitData({
          completed: completedHabits,
          total: totalHabits,
        });
      } else {
        throw new Error("Failed to fetch habits and completions");
      }
    } catch (error) {
      console.error("Error fetching habits and completions:", error);
      setHabitData({ completed: 0, total: 0 });
    }
  };

  const getIncompleteHabits = () => {
    const completedHabitIds = new Set(completions.map((c) => c.habitId));
    return allHabits.filter((habit) => !completedHabitIds.has(habit.id));
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Smile size={32} className="mr-3 text-yellow-300" />
            <h1 className="text-2xl font-bold">Emotional Wellbeing</h1>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-2 sm:space-x-4">
            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full mb-2 sm:mb-0">
              <Smile size={20} className="mr-2 text-yellow-300" />
              <span>{isLoading ? "Loading..." : currentMood || "Not set"}</span>
            </div>

            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full mb-2 sm:mb-0">
              <Target size={20} className="mr-2 text-green-300" />
              <span title={streakData.habitName}>
                {isLoading ? "Loading..." : `${streakData.streak} day streak`}
              </span>
            </div>

            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full mb-2 sm:mb-0">
              <Bell size={20} className="mr-2 text-red-300" />
              <span>
                {isLoading ? "Loading..." : `${upcomingGoals} goals due`}
              </span>
            </div>

            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full mb-2 sm:mb-0 relative">
              <Target size={20} className="mr-2 text-blue-300" />
              <span>
                {isLoading
                  ? "Loading..."
                  : `${habitData.completed}/${habitData.total} habits`}
              </span>
              {!isLoading && habitData.completed < habitData.total && (
                <button
                  className="ml-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => setShowIncompleteHabits(!showIncompleteHabits)}
                >
                  {habitData.total - habitData.completed}
                </button>
              )}
              {showIncompleteHabits && (
                <div ref={incompleteHabitsRef}>
                  <IncompleteHabitsList
                    habits={getIncompleteHabits()}
                    onClose={() => setShowIncompleteHabits(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
