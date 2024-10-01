import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Loader } from "lucide-react";
import { format, isToday, startOfWeek, startOfMonth, isAfter, parseISO } from 'date-fns';

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

type TabValue = 'live' | 'today' | 'week' | 'month';

// Emotion names as received from the API
const EMOTIONS = ['Happy', 'Angry', 'Disgust', 'Fear', 'Neutral', 'Sad', 'Surprise'];

// Mappings for user-friendly display names
const EMOTION_LABELS: { [key: string]: string } = {
  Happy: "Confidence",
  Angry: "Frustration",
  Disgust: "Boredom",
  Fear: "Anxiety",
  Neutral: "Satisfaction",
  Sad: "Disappointment",
  Surprise: "Curiosity"
};

// Colors for each emotion
const COLORS = {
  Happy: "#22c55e",
  Angry: "#dc2626",
  Disgust: "#7c3aed",
  Fear: "#eab308",
  Neutral: "#64748b",
  Sad: "#0ea5e9",
  Surprise: "#db2777"
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-rose-50 p-2 shadow-md rounded-md text-sm border border-rose-200">
        <p className="font-semibold text-rose-800">{`Time: ${label}`}</p>
        <p className="text-rose-600">
          {`Dominant: ${EMOTION_LABELS[data.dominantEmotion] || data.dominantEmotion}`}
        </p>
        {EMOTIONS.map(emotion => (
          <p key={emotion} className="flex justify-between">
            <span style={{ color: COLORS[emotion as keyof typeof COLORS] }}>
              {EMOTION_LABELS[emotion] || emotion}
            </span>
            <span>{data[emotion.toLowerCase()].toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AllPDFEmotionsData: React.FC = () => {
  const [data, setData] = useState<EmotionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('live');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EmotionData[]>("/api/get-pdf-emotions-data");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch PDF emotion data", error);
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
        <Loader className="animate-spin text-rose-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 justify-center items-center text-rose-500">
        <p>No PDF emotion data available</p>
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
      .map(entry => ({
        ...entry,
        timestamp: format(parseISO(entry.timestamp), getDateFormat(range)),
      }))
      .sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());
  };

  const renderEmotionChart = (range: TabValue) => {
    let filteredData = filterDataByTimeRange(data, range);
    if (range === 'live') {
      filteredData = filteredData.slice(-20);
    }
    const formattedData = formatData(filteredData, range);

    return (
      <Card className="w-full shadow-sm bg-gradient-to-br from-rose-50 to-pink-50">
        <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100">
          <CardTitle className="text-sm font-semibold text-rose-800">
            {range.charAt(0).toUpperCase() + range.slice(1)} PDF Emotion Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                <XAxis dataKey="timestamp" stroke="#e11d48" />
                <YAxis stroke="#e11d48" />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => EMOTION_LABELS[value as keyof typeof EMOTION_LABELS]} />
                {EMOTIONS.map(emotion => (
                  <Bar
                    key={emotion}
                    dataKey={emotion.toLowerCase()}
                    name={emotion}
                    stroke={COLORS[emotion as keyof typeof COLORS]}
                    fill={COLORS[emotion as keyof typeof COLORS]}
                  >
                    {formattedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.dominantEmotion === emotion ? COLORS[emotion as keyof typeof COLORS] : `${COLORS[emotion as keyof typeof COLORS]}80`}
                      />
                    ))}
                  </Bar>
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
        <TabsList className="bg-rose-100 text-rose-800">
          <TabsTrigger value="live" className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900">Today</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900">This Week</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {renderEmotionChart(activeTab)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllPDFEmotionsData;