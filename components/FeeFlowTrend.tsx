import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type MoodType = "Happy" | "Content" | "Calm" | "Neutral" | "Bored" | "Frustrated" | "Sad" | "Depressed";

interface ChartDataPoint {
  name: string;
  value: number;
  mood: MoodType;
}

interface TrendData {
  trendPercentage: number;
  chartData: ChartDataPoint[];
}

const moodColors: Record<MoodType, string> = {
  "Happy": "#FFD700",     // Bright Gold
  "Content": "#00FF00",   // Bright Green
  "Calm": "#1E90FF",      // Bright Blue
  "Neutral": "#FFFFFF",   // White
  "Bored": "#FF69B4",     // Hot Pink
  "Frustrated": "#FF4500", // Orange Red
  "Sad": "#4169E1",       // Royal Blue
  "Depressed": "#8A2BE2"  // Blue Violet
};

const moodEmojis: Record<MoodType, string> = {
  "Happy": "😊",
  "Content": "🙂",
  "Calm": "😌",
  "Neutral": "😐",
  "Bored": "😒",
  "Frustrated": "😠",
  "Sad": "😢",
  "Depressed": "😞"
};

const allMoods: MoodType[] = ["Happy", "Content", "Calm", "Neutral", "Bored", "Frustrated", "Sad", "Depressed"];

const FeeFlowTrend: React.FC = () => {
  const [trendData, setTrendData] = useState<TrendData | null>(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await fetch('/api/get-feel-flow-trend');
        if (!response.ok) {
          throw new Error('Failed to fetch trend data');
        }
        const data: TrendData = await response.json();
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    };

    fetchTrendData();
  }, []);

  if (!trendData) {
    return <div>Loading...</div>;
  }

  const { trendPercentage, chartData } = trendData;

  const allMoodsChartData = allMoods.map(mood => {
    const existingData = chartData.find(item => item.mood === mood);
    return existingData || { name: mood, value: 0, mood: mood };
  });

  const angle = (Math.abs(trendPercentage) / 100) * 135; // Adjusted to 135 degrees for a smaller arc

  // Define constants for arc calculations
  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  // Calculate the endpoint of the arc
  const endX = centerX + Math.sin((angle * Math.PI) / 180) * radius;
  const endY = centerY - Math.cos((angle * Math.PI) / 180) * radius;

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ChartDataPoint;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded shadow">
          <p className="label">{`${moodEmojis[dataPoint.mood]} ${dataPoint.mood}: ${dataPoint.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white rounded-xl shadow-2xl overflow-hidden w-[280px] h-[400px] flex flex-col">
      <div className="w-[260px] h-[200px] ml-2 mt-2 relative">
        <svg
          viewBox="0 0 240 140"
          className="w-[240px] absolute top-1 left-1/2 transform -translate-x-1/2"
        >
          <defs>
            <linearGradient
              id="speedometerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#ADFF2F" />
              <stop offset="100%" stopColor="#90EE90" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d="M40 120 A 80 80 0 0 1 200 120"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="30"
            strokeLinecap="round"
          />
          {/* Gradient arc */}
          <path
            d={`M40 120 A 80 80 0 0 1 ${endX} ${endY}`}
            fill="none"
            stroke="url(#speedometerGradient)"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full pt-32">
          <h2 className="text-xl font-bold">Mood Flow</h2>
          <h2 className="text-xl font-bold mb-2">Trend</h2>
          <div className="mt-2 bg-[#E8F3DC] text-[#4CAF50] px-4 py-1 rounded-full inline-flex items-center">
            {trendPercentage >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="ml-1 font-semibold">{Math.abs(trendPercentage).toFixed(2)}%</span>
          </div>
        </div>
      </div>
      <div className="w-[260px] h-[50px] ml-2 mt-4 relative flex justify-center items-center">
        <h4 className="text-sm font-semibold">Today Mood Check-ins</h4>
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={allMoodsChartData} barGap={8} barSize={6}>
            <XAxis dataKey="mood" axisLine={false} tickLine={false} tick={false} />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[3, 3, 3, 3]}>
              {allMoodsChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={moodColors[entry.mood]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FeeFlowTrend;