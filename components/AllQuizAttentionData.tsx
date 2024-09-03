import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from "lucide-react";
import { format, isToday, startOfWeek, startOfMonth, isAfter, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AttentionData = {
  id: number;
  level: number;
  timestamp: string;
  userId: string;
};

type TabValue = 'live' | 'today' | 'week' | 'month';

const graphColorSchemes = {
  live: { stroke: "#C4B5FD", fill: "#DDD6FE" },
  today: { stroke: "#A78BFA", fill: "#C4B5FD" },
  week: { stroke: "#8B5CF6", fill: "#A78BFA" },
  month: { stroke: "#7C3AED", fill: "#8B5CF6" }
};

const AllQuizAttentionData: React.FC = () => {
  const [data, setData] = useState<AttentionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('live');

  useEffect(() => {
    const fetchAttentionData = async () => {
      try {
        const response = await axios.get("/api/get-quiz-attention-data");
        const allData: AttentionData[] = response.data;
        setData(allData);
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
        <p>No quiz attention data available</p>
      </div>
    );
  }

  const filterDataByTimeRange = (data: AttentionData[], range: TabValue): AttentionData[] => {
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

  const formatData = (data: AttentionData[], range: TabValue) => {
    return data
      .map(entry => {
        try {
          const date = parseISO(entry.timestamp);
          return {
            ...entry,
            timestamp: format(date, getDateFormat(range))
          };
        } catch (error) {
          console.error("Error formatting date:", entry.timestamp);
          return null;
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getDateFormat = (range: TabValue): string => {
    switch (range) {
      case 'live':
        return "HH:mm";
      case 'today':
        return "HH:mm";
      case 'week':
        return "EEE dd";
      case 'month':
        return "MMM dd";
      default:
        return "yyyy-MM-dd HH:mm";
    }
  };

  const renderAttentionChart = (range: TabValue) => {
    let filteredData = filterDataByTimeRange(data, range);
    if (range === 'live') {
      filteredData = filteredData.slice(-20);
    }
    const formattedData = formatData(filteredData, range);
    const colors = graphColorSchemes[range];

    return (
      <Card className="w-full shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
          <CardTitle className="text-sm font-semibold text-purple-800">
            {range.charAt(0).toUpperCase() + range.slice(1)} Quiz Attention Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8b4fe" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#7c3aed"
                  tick={{ fontSize: 12 }}
                  interval={range === 'month' ? 2 : 0}
                />
                <YAxis stroke="#7c3aed" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 4px rgba(124,58,237,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#7c3aed' }}
                  labelFormatter={(value) => value} // Use the formatted timestamp directly
                />
                <Area type="monotone" dataKey="level" stroke={colors.stroke} fill={colors.fill} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="mb-12">
        <TabsList className="bg-purple-100 text-purple-800">
          <TabsTrigger value="live" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-900">Live Data</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-900">Today</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-900">This Week</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-900">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {renderAttentionChart(activeTab)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllQuizAttentionData;