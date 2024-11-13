import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Moon, Sun, Coffee, Book, Dumbbell, Clock } from "lucide-react";

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  Sleep: Moon,
  Wake: Sun,
  Coffee: Coffee,
  Read: Book,
  Exercise: Dumbbell,
  default: Clock,
};

const HabitReminderCard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentHabitIndex, setCurrentHabitIndex] = useState(0);
  const [motivationalLine, setMotivationalLine] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch("/api/habits/incomplete-habits");
        if (!response.ok) {
          throw new Error("Failed to fetch incomplete habits");
        }
        const data = await response.json();
        setHabits(data.incompleteHabits);
      } catch (err) {
        setError("Error fetching incomplete habits");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      const fetchMotivationalLine = async () => {
        try {
          const habitName = habits[currentHabitIndex].name;
          const response = await fetch(
            `/api/habits/habit-reminder-motivation?habitName=${encodeURIComponent(habitName)}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch motivational line");
          }
          const data = await response.json();
          setMotivationalLine(data.motivationalLine);
        } catch (err) {
          console.error("Error fetching motivational line:", err);
          setMotivationalLine("Stay motivated!");
        }
      };

      fetchMotivationalLine();

      const interval = setInterval(() => {
        setCurrentHabitIndex((prevIndex) => (prevIndex + 1) % habits.length);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [habits, currentHabitIndex]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (habits.length === 0) {
    return <div>No upcoming habit reminders!</div>;
  }

  const currentHabit = habits[currentHabitIndex];
  const IconComponent =
    iconMap[currentHabit.name.split(" ")[0]] || iconMap.default;
  return (
    <Card className="bg-blue-500 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
      <div className="bg-orange-400 text-orange-800 text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
          Upcoming Habit Reminder
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xl font-bold">{currentHabit.name}</span>
          <IconComponent className="w-6 h-6 text-yellow-300" />
        </div>
        <p className="text-sm opacity-90 min-h-[3em] pt-2 transition-opacity duration-500 ease-in-out">
          {motivationalLine}
        </p>
      </CardContent>
    </Card>
  );
};
export default HabitReminderCard;
