"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
}

const GratitudeLog: React.FC = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    // In a real application, you&apos;d fetch this data from an API
    const fetchedEntries = [
      { id: '1', date: '2024-09-01', content: "I m grateful for my supportive family." },
      { id: '2', date: '2024-09-02', content: "I m thankful for the beautiful weather today." },
      { id: '3', date: '2024-09-03', content: "I appreciate the opportunity to learn new things at work." },
    ];
    setEntries(fetchedEntries);
  }, []);

  const handleNewEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewEntry(e.target.value);
  };

  const handleSubmitEntry = () => {
    if (newEntry.trim()) {
      const newEntryObject: GratitudeEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        content: newEntry.trim()
      };
      setEntries([newEntryObject, ...entries]);
      setNewEntry("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Gratitude Log</h1>

      <Card className="border-gray-200 mb-6">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl">New Gratitude Entry</CardTitle>
          <CardDescription className="text-blue-200">
            What are you grateful for today?
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <Textarea
            placeholder="I&apos;m grateful for..."
            value={newEntry}
            onChange={handleNewEntryChange}
            className="mb-4"
          />
          <Button onClick={handleSubmitEntry}>Add Entry</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="border-gray-200">
            <CardHeader className="bg-blue-100 text-blue-800">
              <CardTitle className="text-lg">{entry.date}</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <p>{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200 mt-8">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl">Gratitude Insights</CardTitle>
          <CardDescription className="text-blue-200">
            The power of positive thinking
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <p>
            Practicing gratitude has numerous benefits for your mental health and overall well-being:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>It can improve your mood and increase positive emotions.</li>
            <li>Gratitude may help reduce stress and anxiety.</li>
            <li>It can enhance your relationships and social connections.</li>
            <li>Regular gratitude practice may lead to better sleep quality.</li>
          </ul>
          <p className="mt-4">
            Remember, it is not about having everything perfect - it is about appreciating what you have.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GratitudeLog;