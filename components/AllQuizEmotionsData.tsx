import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader } from "lucide-react";
import { format, isToday, startOfWeek, startOfMonth, isAfter, parseISO } from 'date-fns';

type EmotionData = {
  surprise: any;
  sad: any;
  neutral: any;
  disgust: any;
  angry: any;
  happy: any;
  fear: any;
  id: number;
  confidence: number;
  frustration: number;
  boredom: number;
  anxiety: number;
  satisfaction: number;
  disappointment: number;
  curiosity: number;
  dominantEmotion: string;
  timestamp: string;
  userId: string;
};

type TabValue = 'live' | 'today' | 'week' | 'month';

// Updated emotion names
const EMOTIONS = ['Confidence', 'Frustration', 'Boredom', 'Anxiety', 'Satisfaction', 'Disappointment', 'Curiosity'];

// Updated mappings for API to display names
const EMOTION_LABELS: { [key: string]: string } = {
  Happy: "Confidence",
  Angry: "Frustration",
  Disgust: "Boredom",
  Fear: "Anxiety",
  Neutral: "Satisfaction",
  Sad: "Disappointment",
  Surprise: "Curiosity"
};

// Updated colors for each emotion
const COLORS = {
  Confidence: "#22c55e",
  Frustration: "#dc2626",
  Boredom: "#7c3aed",
  Anxiety: "#eab308",
  Satisfaction: "#64748b",
  Disappointment: "#0ea5e9",
  Curiosity: "#db2777"
};

const graphColorSchemes = {
  live: { stroke: "#F472B6", fill: "#FBCFE8" },
  today: { stroke: "#EC4899", fill: "#F472B6" },
  week: { stroke: "#DB2777", fill: "#EC4899" },
  month: { stroke: "#BE185D", fill: "#DB2777" }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-rose-50 p-2 shadow-md rounded-md text-sm border border-rose-200">
        <p className="font-semibold text-rose-800">{`Time: ${label}`}</p>
        <p className="text-rose-600">
          {`Dominant: ${data.dominantEmotion}`}
        </p>
        {EMOTIONS.map(emotion => (
          <p key={emotion} className="flex justify-between">
            <span style={{ color: COLORS[emotion as keyof typeof COLORS] }}>
              {emotion}
            </span>
            <span>{data[emotion.toLowerCase()].toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AllQuizEmotionsData: React.FC = () => {
  const [data, setData] = useState<EmotionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('live');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EmotionData[]>("/api/get-quiz-emotions-data");
        // Transform the data to use new emotion names
        const transformedData = response.data.map(item => ({
          ...item,
          confidence: item.happy,
          frustration: item.angry,
          boredom: item.disgust,
          anxiety: item.fear,
          satisfaction: item.neutral,
          disappointment: item.sad,
          curiosity: item.surprise,
          dominantEmotion: EMOTION_LABELS[item.dominantEmotion] || item.dominantEmotion
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Failed to fetch quiz emotion data", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleTabChange = (value: string) => {
    if (value === 'live' || value === 'today' || value === 'week' || value === 'month') {
      setActiveTab(value as TabValue);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader className="animate-spin text-pink-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 justify-center items-center text-pink-500">
        <p>No quiz emotion data available</p>
      </div>
    );
  }

  const filterDataByTimeRange = (data: EmotionData[], range: TabValue): EmotionData[] => {
    const now = new Date();
    return data.filter(entry => {
      try {
        const entryDate = parseISO(entry.timestamp);
        switch (range) {
          case 'live':
            return true; // We'll take the last 20 entries later
          case 'today':
            return isToday(entryDate);
          case 'week':
            return isAfter(entryDate, startOfWeek(now));
          case 'month':
            return isAfter(entryDate, startOfMonth(now));
          default:
            return true;
        }
      } catch (error) {
        console.error("Invalid date:", entry.timestamp);
        return false;
      }
    });
  };

  const getDateFormat = (range: TabValue): string => {
    switch (range) {
      case 'live':
        return "HH:mm";
      case 'today':
        return "HH:mm";
      case 'week':
        return "EEE";
      case 'month':
        return "MMM d";
      default:
        return "yyyy-MM-dd HH:mm";
    }
  };

  const formatData = (data: EmotionData[], range: TabValue) => {
    return data
      .map(entry => {
        try {
          const date = parseISO(entry.timestamp);
          return {
            ...entry,
            timestamp: format(date, getDateFormat(range)),
            fullTimestamp: format(date, "yyyy-MM-dd HH:mm:ss")
          };
        } catch (error) {
          console.error("Error formatting date:", entry.timestamp);
          return null;
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => new Date(a.fullTimestamp).getTime() - new Date(b.fullTimestamp).getTime());
  };

  const renderEmotionChart = (range: TabValue) => {
    let filteredData = filterDataByTimeRange(data, range);
    if (range === 'live') {
      filteredData = filteredData.slice(-20);
    }
    const formattedData = formatData(filteredData, range);
    const colors = graphColorSchemes[range];

    const getAxisInterval = (range: TabValue) => {
      switch (range) {
        case 'live':
          return 4;
        case 'today':
          return Math.floor(formattedData.length / 6);
        case 'week':
          return 'preserveStartEnd';
        case 'month':
          return Math.floor(formattedData.length / 8);
        default:
          return 0;
      }
    };

    return (
      <Card className="w-full shadow-sm bg-gradient-to-br from-pink-50 to-rose-50">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100">
          <CardTitle className="text-sm font-semibold text-pink-800">
            {range.charAt(0).toUpperCase() + range.slice(1)} Quiz Emotion Intensities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fbcfe8" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#db2777"
                  tick={{ fontSize: 12 }}
                  interval={getAxisInterval(range)}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#db2777" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {EMOTIONS.map(emotion => (
                  <Bar key={emotion} dataKey={emotion.toLowerCase()} fill={COLORS[emotion as keyof typeof COLORS]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 bg-[#F8F9FA]">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-12">
        <TabsList className="bg-pink-100 text-pink-800">
          <TabsTrigger value="live" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-900">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-900">Today</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-900">This Week</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-900">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {renderEmotionChart(activeTab)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllQuizEmotionsData;