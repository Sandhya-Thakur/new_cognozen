import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'react-hot-toast';

interface Habit {
  id: number;
  name: string;
}

interface HabitCompletion {
  habitId: number;
  completedAt: string;
  value: number;
}

const HabitProgressCard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("Stay on target, harness your potential, and reach new heights!");

  const fetchHabitsAndCompletions = async () => {
    setLoading(true);
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        fetch('/api/habits/all'),
        fetch('/api/habits/today-completion')
      ]);

      if (habitsResponse.ok && completionsResponse.ok) {
        const habitsData = await habitsResponse.json();
        const completionsData = await completionsResponse.json();
        setHabits(habitsData.habits);
        setCompletions(completionsData.completions);
      } else {
        toast.error('Failed to fetch habits and completions');
      }
    } catch (error) {
      console.error('Error fetching habits and completions:', error);
      toast.error('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMotivationalQuote = useCallback(async () => {
    try {
      const response = await fetch('/api/motivational-quote');
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
      } else {
        console.error('Failed to fetch motivational quote');
      }
    } catch (error) {
      console.error('Error fetching motivational quote:', error);
    }
  }, []);

  useEffect(() => {
    fetchHabitsAndCompletions();
    fetchMotivationalQuote();

    // Set up interval to fetch new quote every 2 hours
    const quoteInterval = setInterval(fetchMotivationalQuote, 2 * 60 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(quoteInterval);
  }, [fetchMotivationalQuote]);

  const current = completions.length;
  const total = habits.length;

  if (loading) {
    return <div>Loading habits...</div>;
  }

  return (
    <Card className="bg-blue-500 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="bg-yellow-400 text-blue-900 text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
          Keep Going!
        </div>
        <div className="text-xl font-bold mb-3">
          {current} of {total}
        </div>
        <p className="text-l">
          {quote}
        </p>
      </CardContent>
    </Card>
  );
};

export default HabitProgressCard;