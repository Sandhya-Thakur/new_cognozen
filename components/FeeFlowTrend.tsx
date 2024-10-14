import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

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

const moodValues: Record<MoodType, number> = {
  "Happy": 7,
  "Content": 6,
  "Calm": 5,
  "Neutral": 4,
  "Bored": 3,
  "Frustrated": 2,
  "Sad": 1,
  "Depressed": 0
};

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

  // Process chart data
  const processedChartData = chartData.filter(data => data.value > 0);
  
  let currentMood: MoodType = "Neutral";
  if (processedChartData.length > 0) {
    currentMood = processedChartData.reduce((max, mood) => 
      moodValues[mood.mood as MoodType] > moodValues[max.mood as MoodType] ? mood : max, 
      processedChartData[0]
    ).mood as MoodType;
  }

  const averageMoodValue = processedChartData.reduce((sum, mood) => sum + moodValues[mood.mood as MoodType], 0) / processedChartData.length;
  const moodPercentage = ((averageMoodValue - 0) / (7 - 0)) * 100;

  return (
    <Card className="bg-white rounded-xl shadow-2xl overflow-hidden w-[280px] flex flex-col p-6">
      <h2 className="text-xl font-bold text-center mb-6">Mood Meter</h2>
      
      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-orange-400"
          style={{ width: `${moodPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between mb-6">
        <span className="text-2xl">{moodEmojis["Happy"]}</span>
        <span className="text-2xl">{moodEmojis["Depressed"]}</span>
      </div>

      <div className="text-center mb-6">
        <span className="text-xl font-semibold">Current Mood: </span>
        <span className="text-xl">{moodEmojis[currentMood]}  {currentMood}</span>
      </div>

      <div className="mb-6 bg-[#E8F3DC] text-[#4CAF50] px-4 py-2 rounded-full flex items-center justify-center">
        {trendPercentage >= 0 ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        <span className="ml-1 font-semibold">{Math.abs(trendPercentage).toFixed(2)}%</span>
      </div>

      <h4 className="text-lg font-semibold text-center mb-4">Today Mood Check-ins</h4>
      
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-400"
          style={{ width: `${(processedChartData.length / 24) * 100}%` }}
        />
      </div>
    </Card>
  );
};

export default FeeFlowTrend;