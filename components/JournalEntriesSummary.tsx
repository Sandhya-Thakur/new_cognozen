"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JournalEntry {
  id: number;
  content: string;
  createdAt: string;
}

const JournalEntriesSummary: React.FC = () => {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [weeklyEntries, setWeeklyEntries] = useState<JournalEntry[]>([]);
  const [monthlyEntries, setMonthlyEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // Fetch journal entries from your API
    // This is a placeholder. Replace with actual API calls.
    const fetchEntries = async () => {
      // const response = await fetch('/api/journal-entries');
      // const data = await response.json();
      // setRecentEntries(data.recent);
      // setWeeklyEntries(data.weekly);
      // setMonthlyEntries(data.monthly);

      // Placeholder data
      setRecentEntries([
        { id: 1, content: "Today was a productive day. I completed all my tasks.", createdAt: "2024-08-29T10:00:00Z" },
        { id: 2, content: "Feeling a bit stressed about the upcoming project deadline.", createdAt: "2024-08-28T09:30:00Z" },
      ]);
      setWeeklyEntries([
        { id: 3, content: "This week has been challenging but rewarding.", createdAt: "2024-08-25T11:00:00Z" },
        { id: 4, content: "I've been consistent with my meditation practice this week.", createdAt: "2024-08-22T08:45:00Z" },
      ]);
      setMonthlyEntries([
        { id: 5, content: "Reflecting on this month's progress. I've grown in many ways.", createdAt: "2024-08-15T14:20:00Z" },
        { id: 6, content: "Started a new hobby this month. It's been fun and relaxing.", createdAt: "2024-08-05T16:30:00Z" },
      ]);
    };

    fetchEntries();
  }, []);

  const renderEntries = (entries: JournalEntry[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="border-[#C0C0C0]">
          <CardHeader className="bg-[#0F52BA] text-white">
            <CardTitle className="text-lg">
              {new Date(entry.createdAt).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-4">
            <p>{entry.content.length > 100 ? `${entry.content.substring(0, 100)}...` : entry.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Journal Entries Summary</h1>

      <Tabs defaultValue="recent" className="mb-12">
        <TabsList className="bg-[#0F52BA] text-white">
          <TabsTrigger value="recent" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Recent Entries</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Weekly Summary</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Monthly Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          {renderEntries(recentEntries)}
        </TabsContent>

        <TabsContent value="weekly">
          {renderEntries(weeklyEntries)}
        </TabsContent>

        <TabsContent value="monthly">
          {renderEntries(monthlyEntries)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalEntriesSummary;