import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Activity {
  title: string;
  description: string;
}

interface SuggestedActivity {
  id: number;
  date: string;
  mood: string;
  activities: Activity[];
}

interface ActivitiesData {
  [key: string]: SuggestedActivity[];
}

const MoodBoosterDashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivitiesData>({
    today: [],
    week: [],
    month: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    today: null,
    week: null,
    month: null,
  });

  const fetchActivities = async (period: string) => {
    console.log(`Fetching activities for ${period}...`);
    try {
      const response = await fetch(`/api/get-mood-suggested-activities?period=${period}`);
      console.log(`${period} response status:`, response.status);
      
      const responseText = await response.text();
      console.log(`${period} response text:`, responseText);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`No activities found for ${period}`);
          setActivities(prev => ({ ...prev, [period]: [] }));
          setErrors(prev => ({ ...prev, [period]: `No activities found for ${period}` }));
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = JSON.parse(responseText) as SuggestedActivity[];
        console.log(`${period} parsed data:`, data);
        setActivities(prev => ({ ...prev, [period]: data }));
        setErrors(prev => ({ ...prev, [period]: null }));
      }
    } catch (e: unknown) {
      console.error(`Error fetching ${period} activities:`, e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setErrors(prev => ({ ...prev, [period]: `Failed to fetch ${period} activities: ${errorMessage}` }));
    }
  };

  useEffect(() => {
    const fetchAllActivities = async () => {
      setLoading(true);
      await Promise.all(['today', 'week', 'month'].map(fetchActivities));
      setLoading(false);
    };

    fetchAllActivities();
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

  const renderSuggestedActivity = (suggestedActivity: SuggestedActivity) => (
    <Card key={suggestedActivity.id} className="mb-6 border-[#E0E0E0] rounded-xl overflow-hidden">
      <CardHeader className="bg-[#4A90E2] text-white">
        <CardTitle className="text-xl">{suggestedActivity.mood}</CardTitle>
        <div className="text-sm">{formatDate(suggestedActivity.date)}</div>
      </CardHeader>
      <CardContent className="bg-white p-4">
        <h3 className="font-semibold mb-2">Suggested Activities:</h3>
        <ul className="list-disc pl-5 mb-4">
          {suggestedActivity.activities.map((activity, index) => (
            <li key={index} className="mb-2">
              <h4 className="font-medium">{activity.title}</h4>
              <p>{activity.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const renderActivities = (period: string) => {
    const periodActivities = activities[period];
    const error = errors[period];

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (periodActivities.length === 0) {
      return (
        <Alert>
          <AlertTitle>No Activities</AlertTitle>
          <AlertDescription>No activities found for this period.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-6">
        {periodActivities.map(renderSuggestedActivity)}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading activities...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F0F4F8]">
      <h1 className="text-xl font-bold mb-8 text-[#2C5282]">Mood Booster Activities</h1>

      <Tabs defaultValue="today" className="mb-12">
        <TabsList className="bg-[#4A90E2] text-white rounded-t-xl">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#63B3ED] data-[state=active]:text-[#2A4365]">current day Activities</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-[#63B3ED] data-[state=active]:text-[#2A4365]">This Week Activities</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#63B3ED] data-[state=active]:text-[#2A4365]">This Month Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {renderActivities("today")}
        </TabsContent>

        <TabsContent value="week">
          {renderActivities("week")}
        </TabsContent>

        <TabsContent value="month">
          {renderActivities("month")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodBoosterDashboard;