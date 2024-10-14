"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format, isWithinInterval } from 'date-fns';

interface MoodData {
  mood: string;
  intensity: number;
  timestamp: string;
}

const moodToNumber = {
  Happy: 7,
  Content: 6,
  Calm: 5,
  Neutral: 4,
  Bored: 3,
  Frustrated: 2,
  Sad: 1,
  Depressed: 0,
};

const numberToMood = {
  7: "Happy",
  6: "Content",
  5: "Calm",
  4: "Neutral",
  3: "Bored",
  2: "Frustrated",
  1: "Sad",
  0: "Depressed",
};

const moodColors = {
  Happy: "#fde047",      // yellow-300
  Content: "#bbf7d0",    // green-200
  Calm: "#bfdbfe",       // blue-200
  Neutral: "#d1d5db",    // gray-300
  Bored: "#e5e7eb",      // gray-200
  Frustrated: "#f87171", // red-400
  Sad: "#93c5fd",        // blue-300
  Depressed: "#1e3a8a",  // blue-900
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
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // 1 represents Monday
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const thisWeekData = data.filter((entry: MoodData) =>
          isWithinInterval(new Date(entry.timestamp), { start: weekStart, end: weekEnd })
        );

        const sortedData = thisWeekData.sort(
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
    return format(date, 'EEEEEE'); // Returns the short day name (e.g., "Mon", "Tue")
  };

  const formatYAxis = (value: number) => {
    return numberToMood[value as keyof typeof numberToMood] || "";
  };

  if (isLoading)
    return <div className="text-center py-4 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  const chartData = moodData.map((entry) => ({
    ...entry,
    moodValue: moodToNumber[entry.mood as keyof typeof moodToNumber] || 0,
  }));

  return (
    <Card className="max-w-3xl mx-auto shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
        <CardTitle className="text-lg font-semibold text-gray-700">This Week Mood Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {moodData.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No mood data available for this week.
          </p>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatDate}
                  stroke="#6b7280"
                  fontSize={12}
                  label={{ value: "Day of Week", position: "bottom", offset: -10, fill: "#4b5563" }}
                />
                <YAxis
                  dataKey="moodValue"
                  domain={[0, 7]}
                  tickFormatter={formatYAxis}
                  stroke="#6b7280"
                  fontSize={12}
                  label={{ value: "Mood", angle: -90, position: "insideLeft", offset: -20, fill: "#4b5563" }}
                />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
                          <p className="font-medium text-gray-700">{format(new Date(label), 'EEEE')}</p>
                          <p className="text-sm" style={{ color: moodColors[data.mood as keyof typeof moodColors] }}>{`Mood: ${data.mood}`}</p>
                          <p className="text-sm text-gray-600">{`Intensity: ${data.intensity}`}</p>
                          <p className="text-xs text-gray-400">{format(new Date(label), 'MMM d, yyyy HH:mm')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                {Object.entries(moodToNumber).map(([mood, value]) => (
                  <ReferenceLine
                    key={mood}
                    y={value}
                    stroke={moodColors[mood as keyof typeof moodColors]}
                    strokeDasharray="3 3"
                    label={{
                      value: mood,
                      position: 'right',
                      fill: moodColors[mood as keyof typeof moodColors],
                      fontSize: 10,
                    }}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="moodValue"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 6, strokeWidth: 2, stroke: "#4338CA", fill: "white" }}
                  activeDot={{ r: 8, stroke: "#4338CA", strokeWidth: 2, fill: "#818CF8" }}
                  name="Mood"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTrendsData;