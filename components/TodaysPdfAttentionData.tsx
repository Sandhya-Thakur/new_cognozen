import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from "lucide-react";
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

type AttentionData = {
  id: number;
  level: number;
  timestamp: string;
  userId: string;
};

const TodaysPdfAttentionData: React.FC = () => {
  const [data, setData] = useState<AttentionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttentionData = async () => {
      try {
        const response = await axios.get("/api/get-pdf-attention-data");
        const allData: AttentionData[] = response.data;

        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        const thisWeekData = allData.filter(entry =>
          isWithinInterval(new Date(entry.timestamp), { start: weekStart, end: weekEnd })
        );

        setData(thisWeekData);
      } catch (error) {
        console.error("Failed to fetch PDF attention data", error);
      }
      setIsLoading(false);
    };
    fetchAttentionData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-64 justify-center items-center text-amber-500">
        <p>No PDF attention data available for this week</p>
      </div>
    );
  }

  const formattedData = data
    .map(entry => ({
      ...entry,
      timestamp: format(new Date(entry.timestamp), "EEE HH:mm")
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <Card className="w-full shadow-sm rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
        <CardTitle className="text-sm font-semibold text-amber-800">This Week's PDF Reading Attention Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" />
              <XAxis dataKey="timestamp" stroke="#d97706" />
              <YAxis stroke="#d97706" />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 4px rgba(217,119,6,0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#d97706' }}
              />
              <Area type="monotone" dataKey="level" stroke="#f59e0b" fill="#fbbf24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysPdfAttentionData;