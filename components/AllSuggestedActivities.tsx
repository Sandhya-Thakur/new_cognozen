"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SuggestedActivity {
  id: number;
  mood: string;
  activities: string;
  createdAt: string;
}

const AllSuggestedActivities: React.FC = () => {
  // Example data - replace this with actual data from your backend
  const [recentActivities] = useState<SuggestedActivity[]>([
    { id: 1, mood: "Happy", activities: "1. Go for a nature walk\n2. Call a friend\n3. Try a new hobby", createdAt: new Date().toISOString() },
    { id: 2, mood: "Stressed", activities: "1. Practice deep breathing\n2. Do a quick yoga session\n3. Listen to calming music", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  ]);

  const [popularActivities] = useState<SuggestedActivity[]>([
    { id: 3, mood: "Anxious", activities: "1. Meditate for 10 minutes\n2. Write in a journal\n3. Take a warm bath", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 4, mood: "Tired", activities: "1. Take a power nap\n2. Do some light stretching\n3. Have a healthy snack", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  ]);

  const renderActivities = (activities: SuggestedActivity[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="border-[#C0C0C0]">
          <CardHeader className="bg-[#0F52BA] text-white">
            <CardTitle className="text-lg">Mood: {activity.mood}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-4">
            <p className="font-semibold mb-2">Suggested Activities:</p>
            <ul className="list-disc pl-5">
              {activity.activities.split('\n').map((item, index) => (
                <li key={index}>{item.substring(3)}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              Suggested on: {new Date(activity.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Suggested Activities</h1>

      <Tabs defaultValue="recent" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="recent" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Recent Suggestions</TabsTrigger>
          <TabsTrigger value="popular" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Popular Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          {renderActivities(recentActivities)}
        </TabsContent>

        <TabsContent value="popular">
          {renderActivities(popularActivities)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllSuggestedActivities;