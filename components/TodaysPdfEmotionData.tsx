import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, Cell } from 'recharts';
import { Loader } from "lucide-react";
import { format, isToday } from 'date-fns';

type EmotionData = {
  id: number;
  timestamp: string;
  userId: string;
  dominantEmotion: string;
  happy: number;
  angry: number;
  disgust: number;
  fear: number;
  neutral: number;
  sad: number;
  surprise: number;
};

const EMOTIONS = ['happy', 'angry', 'disgust', 'fear', 'neutral', 'sad', 'surprise'];
const COLORS = {
  happy: "#22c55e",
  angry: "#dc2626",
  disgust: "#7c3aed",
  fear: "#eab308",
  neutral: "#64748b",
  sad: "#0ea5e9",
  surprise: "#db2777"
};

const EMOTION_VALUES = {
  happy: 1,
  angry: 2,
  disgust: 3,
  fear: 4,
  neutral: 5,
  sad: 6,
  surprise: 7
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-rose-50 p-2 shadow-md rounded-md text-sm border border-rose-200">
        <p className="font-semibold text-rose-800">{`Time: ${label}`}</p>
        <p className="text-rose-600">{`Dominant: ${data.dominantEmotion}`}</p>
        {EMOTIONS.map(emotion => (
          <p key={emotion} className="flex justify-between">
            <span style={{ color: COLORS[emotion as keyof typeof COLORS] }}>{emotion}</span>
            <span>{data[emotion].toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TodaysPdfEmotionData: React.FC = () => {
  const [data, setData] = useState<EmotionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmotionData = async () => {
      try {
        const response = await axios.get("/api/get-pdf-emotions-data");
        const allData: EmotionData[] = response.data;
        
        const todaysData = allData.filter(entry => 
          isToday(new Date(entry.timestamp))
        );
        
        setData(todaysData);
      } catch (error) {
        console.error("Failed to fetch PDF emotion data", error);
      }
      setIsLoading(false);
    };
    fetchEmotionData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader className="animate-spin text-rose-500" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-64 justify-center items-center text-rose-500">
        <p>No PDF emotion data available for today</p>
      </div>
    );
  }

  const formattedData = data.map(entry => ({
    ...entry,
    timestamp: format(new Date(entry.timestamp), "HH:mm"),
    dominantEmotionValue: EMOTION_VALUES[entry.dominantEmotion as keyof typeof EMOTION_VALUES] || 0
  })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <Card className="w-full shadow-sm bg-gradient-to-br from-rose-50 to-pink-50">
      <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100">
        <CardTitle className="text-sm font-semibold text-rose-800">Today's PDF Reading Emotion Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="timestamp" stroke="#e11d48" />
              <YAxis yAxisId="left" stroke="#e11d48" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 8]} ticks={[1, 2, 3, 4, 5, 6, 7]} stroke="#e11d48" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {EMOTIONS.map(emotion => (
                <Line
                  key={emotion}
                  type="monotone"
                  dataKey={emotion}
                  stroke={COLORS[emotion as keyof typeof COLORS]}
                  strokeWidth={2}
                  dot={false}
                  yAxisId="left"
                />
              ))}
              <Scatter
                name="Dominant Emotion"
                data={formattedData}
                fill="#f43f5e"
                yAxisId="right"
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.dominantEmotion as keyof typeof COLORS]}
                  />
                ))}
              </Scatter>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysPdfEmotionData;