import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Activity, Smile, CheckSquare } from "lucide-react";

interface Recommendation {
  appName: string;
  description: string;
}

const DailyRecommendationCard: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/habits/daily-recommendation");
      if (!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRecommendation(data);
      setError(null);
    } catch (err) {
      setError("Error fetching recommendation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();

    const interval = setInterval(
      () => {
        fetchRecommendation();
      },
      5 * 60 * 1000
    ); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = (appName: string) => {
    switch (appName) {
      case "FeelFlow":
        return <Smile className="w-6 h-6 text-white" />;
      case "Habit-Tracker":
        return <CheckSquare className="w-6 h-6 text-white" />;
      default:
        return <LineChart className="w-6 h-6 text-white" />;
    }
  };

  return (
    <Card className="bg-blue-500 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="bg-yellow-400 text-yellow-800 text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
          Daily Recommendation
        </div>
        {loading && !recommendation ? (
          <p>Loading your daily recommendation...</p>
        ) : error ? (
          <p>Unable to load recommendation. Please try again later.</p>
        ) : recommendation ? (
          <>
            <div className="flex items-center space-x-2 mb-1">
              {getIcon(recommendation.appName)}
              <h3 className="text-xl font-bold">{recommendation.appName}</h3>
            </div>
            <p className="text-sm opacity-90 pt-4">
              {recommendation.description}
            </p>
          </>
        ) : (
          <p>No recommendation available at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRecommendationCard;
