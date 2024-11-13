import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HabitData {
  month: string;
  performance: number;
  completionRate: number;
}

const HabitPerformanceChart: React.FC = () => {
  const [activeTimeRange, setActiveTimeRange] = useState('year');
  const [activeMetrics, setActiveMetrics] = useState<('performance' | 'completionRate')[]>(['performance', 'completionRate']);
  const [data, setData] = useState<HabitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (range: string) => {
    try {
      setLoading(true);
      const [performanceResponse, completionResponse] = await Promise.all([
        fetch(`/api/habits/stats/performance?range=${range}`),
        fetch(`/api/habits/stats/completion-rate?range=${range}`)
      ]);

      if (!performanceResponse.ok || !completionResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const performanceResult = await performanceResponse.json();
      const completionResult = await completionResponse.json();

      // Combine and format the data
      const combinedData = performanceResult.data.map((item: any, index: number) => ({
        month: item.habitName, // Assuming habitName represents the month
        performance: item.rate,
        completionRate: completionResult.data[index].rate
      }));

      setData(combinedData);
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTimeRange);
  }, [activeTimeRange]);

  const handleTimeRangeChange = (value: string) => {
    setActiveTimeRange(value);
  };

  const handleMetricToggle = (metric: 'performance' | 'completionRate') => {
    setActiveMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-[1512px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Habit Performance</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleMetricToggle('performance')}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeMetrics.includes('performance')
                ? 'bg-white text-blue-600 border-blue-600'
                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
            }`}
          >
            {activeMetrics.includes('performance') ? '◉' : '○'} Performance
          </button>
          <button
            onClick={() => handleMetricToggle('completionRate')}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeMetrics.includes('completionRate')
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
            }`}
          >
            {activeMetrics.includes('completionRate') ? '◉' : '○'} Completion Rate
          </button>
        </div>
      </div>
      <div className="mb-6 flex space-x-2 bg-gray-100 rounded-full p-1 w-fit">
        {['year', 'month', 'week', 'day'].map((range) => (
          <button
            key={range}
            onClick={() => handleTimeRangeChange(range)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTimeRange === range
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range === 'year' ? '12 months' :
             range === 'month' ? '30 days' :
             range === 'week' ? '7 days' : '24 hours'}
          </button>
        ))}
      </div>
      <CardContent className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            {activeMetrics.includes('completionRate') && (
              <Area
                type="monotone"
                dataKey="completionRate"
                stroke="#8884d8"
                fillOpacity={0.3}
                fill="url(#colorCompletion)"
              />
            )}
            {activeMetrics.includes('performance') && (
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HabitPerformanceChart;