import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PerformanceData {
  overallPerformance: number;
  emotionalWellbeing: number;
  attentionPerformance: number;
  quizPerformance: number;
  habitConsistency: number;
  goalProgress: number;
  challengeCompletion: number;
  chartData: { name: string; value: number }[];
}

const OverallPerformanceSection: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [timeframe, setTimeframe] = useState<string>('12months');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerformanceData(timeframe);
  }, [timeframe]);

  const fetchPerformanceData = async (selectedTimeframe: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/overall-performance?timeframe=${selectedTimeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      const data: PerformanceData = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Failed to load performance data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!performanceData) return null;

  const timeframeOptions = [
    { value: '12months', label: '12 months' },
    { value: '30days', label: '30 days' },
    { value: '7days', label: '7 days' },
    { value: '24hours', label: '24 hours' },
  ];

  const metrics = [
    { key: 'emotionalWellbeing', label: 'Emotional Wellbeing' },
    { key: 'attentionPerformance', label: 'Attention Performance' },
    { key: 'quizPerformance', label: 'Quiz Performance' },
    { key: 'habitConsistency', label: 'Habit Consistency' },
    { key: 'goalProgress', label: 'Goal Progress' },
    { key: 'challengeCompletion', label: 'Challenge Completion' },
  ] as const;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Overall Performance</CardTitle>
        <div className="flex space-x-2">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeframe === option.value ? "default" : "outline"}
              onClick={() => setTimeframe(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
          <div className="text-3xl font-bold">
            {performanceData.overallPerformance.toFixed(2)}%
          </div>
        </div>

        <div className="h-[400px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={performanceData.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorPerformance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.key}>
              <CardContent className="pt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{metric.label}</h4>
                <div className="text-2xl font-bold">
                  {performanceData[metric.key].toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallPerformanceSection;