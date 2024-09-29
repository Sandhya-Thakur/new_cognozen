import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

interface Habit {
  id: number;
  name: string;
  isActive: boolean;
}

interface HabitCompletion {
  habitId: number;
  completedAt: string;
  value: number;
}

const AllsHabits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodaysHabits = useCallback(async () => {
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        fetch("/api/habits/all", {
          headers: {
            "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
        fetch("/api/habits/today-completion"),
      ]);

      if (habitsResponse.ok && completionsResponse.ok) {
        const habitsData = await habitsResponse.json();
        const completionsData = await completionsResponse.json();
        setHabits(habitsData.habits);
        setCompletions(completionsData.completions);
        setError(null);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching habits and completions:", error);
      setError("Failed to load habits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodaysHabits();
  }, [fetchTodaysHabits]);

  const isHabitCompleted = (habitId: number) => {
    return completions.some((completion) => completion.habitId === habitId);
  };

  const toggleCompletion = (habitId: number) => {
    const completed = isHabitCompleted(habitId);
    toast.success(completed ? "Habit marked as incomplete" : "Habit completed!");
    // API call to update the completion status can be added here
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading habits...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 h-[325px] flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-black-700">Habits</h3>
      {habits.length === 0 ? (
        <p className="text-gray-500">
          No habits scheduled for today. Why not add one?
        </p>
      ) : (
        <div className="overflow-y-auto flex-grow">
          <ul className="space-y-3">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <h4 className="font-medium text-black-700">{habit.name}</h4>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      habit.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {habit.isActive ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={isHabitCompleted(habit.id)}
                    onChange={() => toggleCompletion(habit.id)}
                    className="w-4 h-4"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllsHabits;