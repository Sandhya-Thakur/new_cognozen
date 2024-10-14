import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from "lucide-react";
import { format, isToday, startOfWeek, startOfMonth, isAfter, parseISO } from 'date-fns';

type AttentionData = {
  id: number;
  level: number;
  timestamp: string;
  userId: string;
};

type TabValue = 'today' | 'week' | 'month';

const graphColorSchemes = {
  today: { stroke: "#F59E0B", fill: "#FCD34D" },
  week: { stroke: "#D97706", fill: "#F59E0B" },
  month: { stroke: "#B45309", fill: "#D97706" }
};

const AllPDFAttentionData: React.FC = () => {
  const [data, setData] = useState<AttentionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AttentionData[]>("/api/get-pdf-attention-data");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch PDF attention data", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleTabChange = (value: string) => {
    if (value === 'today' || value === 'week' || value === 'month') {
      setActiveTab(value as TabValue);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <Loader className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 justify-center items-center text-amber-500">
        <p>No PDF attention data available</p>
      </div>
    );
  }

  const filterDataByTimeRange = (data: AttentionData[], range: TabValue): AttentionData[] => {
    const now = new Date();
    return data.filter(entry => {
      try {
        const entryDate = parseISO(entry.timestamp);
        switch (range) {
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

  const formatData = (data: AttentionData[], range: TabValue) => {
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

  const renderAttentionChart = (range: TabValue) => {
    const filteredData = filterDataByTimeRange(data, range);
    const formattedData = formatData(filteredData, range);
    const colors = graphColorSchemes[range];

    const getAxisInterval = (range: TabValue) => {
      switch (range) {
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
      <Card className="w-full shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
          <CardTitle className="text-sm font-semibold text-amber-800">
            {range.charAt(0).toUpperCase() + range.slice(1)} PDF Attention Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#d97706"
                  tick={{ fontSize: 12 }}
                  interval={getAxisInterval(range)}
                  angle={range === 'month' ? -45 : 0}
                  textAnchor={range === 'month' ? 'end' : 'middle'}
                  height={range === 'month' ? 60 : 30}
                />
                <YAxis stroke="#d97706" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 4px rgba(217,119,6,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#d97706' }}
                  labelFormatter={(value, entry) => {
                    if (entry && entry[0] && entry[0].payload && entry[0].payload.fullTimestamp) {
                      return entry[0].payload.fullTimestamp;
                    }
                    return value;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="level" 
                  stroke={colors.stroke} 
                  fill={colors.fill} 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 bg-[#F8F9FA]">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-12">
        <TabsList className="bg-amber-100 text-amber-800">
          <TabsTrigger value="today" className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">Today</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">This Week</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {renderAttentionChart(activeTab)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllPDFAttentionData;