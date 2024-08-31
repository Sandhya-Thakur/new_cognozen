"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GratitudeEntry {
  id: number;
  content: string;
  createdAt: string;
}

const GratitudeLog: React.FC = () => {
  // Example data - replace this with actual data from your backend
  const [todayEntries] = useState<GratitudeEntry[]>([
    { id: 1, content: "I'm grateful for my supportive family.", createdAt: new Date().toISOString() },
    { id: 2, content: "I appreciate the beautiful weather today.", createdAt: new Date().toISOString() },
  ]);

  const [weekEntries] = useState<GratitudeEntry[]>([
    { id: 3, content: "I'm thankful for the progress I made on my project.", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 4, content: "I'm grateful for the delicious meal I had with friends.", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 5, content: "I appreciate the help I received from my colleague.", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  ]);

  const [monthEntries] = useState<GratitudeEntry[]>([
    { id: 6, content: "I'm thankful for the opportunity to learn a new skill.", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 7, content: "I'm grateful for my health and well-being.", createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 8, content: "I appreciate the support of my community during challenging times.", createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
  ]);

  const renderGratitudeEntries = (entries: GratitudeEntry[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="border-[#C0C0C0]">
          <CardHeader className="bg-[#0F52BA] text-white">
            <CardTitle className="text-lg">{new Date(entry.createdAt).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-4">
            <p>{entry.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Gratitude Log</h1>

      <Tabs defaultValue="today" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Today's Entries</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Week's Entries</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month's Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {renderGratitudeEntries(todayEntries)}
        </TabsContent>

        <TabsContent value="week">
          {renderGratitudeEntries(weekEntries)}
        </TabsContent>

        <TabsContent value="month">
          {renderGratitudeEntries(monthEntries)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GratitudeLog;