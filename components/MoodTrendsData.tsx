"use client";
import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

interface MoodData {
  mood: string;
  intensity: number;
  timestamp: string;
}

const moodToNumber = {
  Happy: 5,
  Cool: 4,
  Confused: 3,
  Tired: 2,
  Sad: 1,
  Angry: 0,
};

const numberToMood = {
  5: "Happy",
  4: "Cool",
  3: "Confused",
  2: "Tired",
  1: "Sad",
  0: "Angry",
};

const MoodTrendsData: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch("/api/get-mood-data");
        if (!response.ok) {
          throw new Error("Failed to fetch mood data");
        }
        const data = await response.json();
        // Sort data by timestamp
        const sortedData = data.sort(
          (a: MoodData, b: MoodData) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMoodData(sortedData);
      } catch (err) {
        setError("Error fetching mood data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatYAxis = (value: number) => {
    return numberToMood[value as keyof typeof numberToMood] || "";
  };

  if (isLoading)
    return <div className="text-center py-4">Loading mood trends...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  const chartData = moodData.map((entry) => ({
    ...entry,
    moodValue: moodToNumber[entry.mood as keyof typeof moodToNumber] || 0,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Your Mood Trends
      </h2>
      {moodData.length === 0 ? (
        <p className="text-center text-gray-600">
          No mood data available for visualization.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 60,
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              label={{
                value: "Date",
                position: "insideBottomRight",
                offset: -10,
              }}
            />
            <YAxis
              dataKey="moodValue"
              domain={[0, 5]}
              tickFormatter={formatYAxis}
              label={{ value: "Mood", angle: -90, position: "insideLeft" }}
            />
            <ZAxis dataKey="intensity" range={[50, 400]} name="Intensity" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload, label }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
                      <p>{`Date: ${new Date(data.timestamp).toLocaleDateString()}`}</p>
                      <p>{`Mood: ${data.mood}`}</p>
                      <p>{`Intensity: ${data.intensity}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter name="Mood" data={chartData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodTrendsData;
