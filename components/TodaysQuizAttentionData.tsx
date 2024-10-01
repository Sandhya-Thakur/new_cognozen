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

const TodaysQuizAttentionData: React.FC = () => {
  const [data, setData] = useState<AttentionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttentionData = async () => {
      try {
        const response = await axios.get("/api/get-quiz-attention-data");
        const allData: AttentionData[] = response.data;
        
        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        const thisWeekData = allData.filter(entry =>
          isWithinInterval(new Date(entry.timestamp), { start: weekStart, end: weekEnd })
        );
        
        setData(thisWeekData);
      } catch (error) {
        console.error("Failed to fetch quiz attention data", error);
      }
      setIsLoading(false);
    };
    fetchAttentionData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader className="animate-spin text-purple-500" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-64 justify-center items-center text-purple-500">
        <p>No quiz attention data available for this week</p>
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
    <Card className="w-full rounded-2xl shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
        <CardTitle className="text-sm font-semibold text-purple-800">Current Week Quiz Attention Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8b4fe" />
              <XAxis dataKey="timestamp" stroke="#7c3aed" />
              <YAxis stroke="#7c3aed" />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 4px rgba(124,58,237,0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#7c3aed' }}
              />
              <Area type="monotone" dataKey="level" stroke="#8b5cf6" fill="#a78bfa" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysQuizAttentionData;