import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  id: number;
  content: string;
  createdAt: string;
}

const JournalEntriesSummary: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [deleteEntryId, setDeleteEntryId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/get-journal-data');
      const data = await response.json();
      setEntries(data.entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/get-journal-data?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id));
        setShowAlert(false);
      } else {
        console.error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  const getTodayEntries = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return entries.filter(entry => new Date(entry.createdAt).setHours(0, 0, 0, 0) === today);
  };

  const getWeeklyEntries = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return entries.filter(entry => new Date(entry.createdAt) >= oneWeekAgo);
  };

  const getMonthlyEntries = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return entries.filter(entry => new Date(entry.createdAt) >= oneMonthAgo);
  };

  const renderEntries = (entries: JournalEntry[]) => (
    <div className="grid grid-cols-1 gap-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="border-gray-200 rounded-xl shadow-md overflow-hidden">
          <CardHeader className="bg-[#6366F1] text-white p-4 flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              {new Date(entry.createdAt).toLocaleString()}
            </CardTitle>
            <button 
              onClick={() => {
                setDeleteEntryId(entry.id);
                setShowAlert(true);
              }} 
              className="text-white hover:text-red-300"
            >
              <Trash2 size={20} />
            </button>
          </CardHeader>
          <CardContent className="bg-white p-4">
            <p className="text-gray-800">{entry.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-[#6366F1]">Journal Entries Summary</h1>

      {showAlert && (
        <Alert className="mb-4 bg-red-100 border-red-400 text-red-700">
          <AlertTitle className="font-bold">Are you sure you want to delete this entry?</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete your journal entry.
          </AlertDescription>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAlert(false)}>Cancel</Button>
            <Button onClick={() => deleteEntryId && deleteEntry(deleteEntryId)}>Delete</Button>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="today" className="mb-12">
        <TabsList className="bg-[#6366F1] text-white rounded-lg">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#818CF8] data-[state=active]:text-white">Today Entries</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-[#818CF8] data-[state=active]:text-white">This Week Entries</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-[#818CF8] data-[state=active]:text-white">This Month Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {renderEntries(getTodayEntries())}
        </TabsContent>

        <TabsContent value="weekly">
          {renderEntries(getWeeklyEntries())}
        </TabsContent>

        <TabsContent value="monthly">
          {renderEntries(getMonthlyEntries())}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalEntriesSummary;