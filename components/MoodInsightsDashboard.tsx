import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InsightItem {
  title: string;
  description: string;
}

interface MoodInsight {
  id: number;
  date: string;
  mood: string;
  understanding: {
    title: string;
    description: string;
  };
  impacts: string[];
  strategies: InsightItem[];
  conclusion: string;
}

interface InsightsData {
  [key: string]: MoodInsight[];
}

const MoodInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<InsightsData>({
    today: [],
    week: [],
    month: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (period: string) => {
    try {
      const response = await fetch(`/api/get-all-mood-insights?period=${period}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInsights(prev => ({ ...prev, [period]: data }));
    } catch (e) {
      setError(`Failed to fetch ${period} insights`);
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchAllInsights = async () => {
      setLoading(true);
      await Promise.all(['today', 'week', 'month'].map(fetchInsights));
      setLoading(false);
    };

    fetchAllInsights();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderMoodInsight = (insight: MoodInsight) => (
    <Card key={insight.id} className="mb-6 border-[#E0E0E0] rounded-xl overflow-hidden">
      <CardHeader className="bg-[#4A90E2] text-white">
        <CardTitle className="text-xl">{insight.mood}</CardTitle>
        <div className="text-sm">{formatDate(insight.date)}</div>
      </CardHeader>
      <CardContent className="bg-white p-4">
        <h3 className="font-semibold mb-2">{insight.understanding.title}</h3>
        <p className="mb-4">{insight.understanding.description}</p>
        
        <h4 className="font-semibold mb-2">Impacts:</h4>
        <ul className="list-disc pl-5 mb-4">
          {insight.impacts.map((impact, index) => (
            <li key={index}>{impact}</li>
          ))}
        </ul>
        
        <h4 className="font-semibold mb-2">Strategies:</h4>
        {insight.strategies.map((strategy, index) => (
          <div key={index} className="mb-2">
            <h5 className="font-medium">{strategy.title}</h5>
            <p>{strategy.description}</p>
          </div>
        ))}
        
        <p className="mt-4 font-semibold">{insight.conclusion}</p>
      </CardContent>
    </Card>
  );

  const renderInsights = (periodInsights: MoodInsight[]) => (
    <div className="space-y-6">
      {periodInsights.map(renderMoodInsight)}
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading insights...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F0F4F8]">
      <h1 className="text-xl font-bold mb-8 text-[#2C5282]">Mood Related Insights and tips</h1>

      <Tabs defaultValue="today" className="mb-12">
        <TabsList className="bg-[#4A90E2] text-white rounded-t-xl">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#63B3ED] data-[state=active]:text-[#2A4365]">Current day Insights</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-[#63B3ED] data-[state=active]:text-[#2A4365]">Weekly Insights</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#63B3ED] data-[state=active]:text-[#2A4365]">Monthly Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {renderInsights(insights.today)}
        </TabsContent>

        <TabsContent value="week">
          {renderInsights(insights.week)}
        </TabsContent>

        <TabsContent value="month">
          {renderInsights(insights.month)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodInsightsDashboard;