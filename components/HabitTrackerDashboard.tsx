"use client";


import React, { useState } from "react";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';


interface HabitData {
 name: string;
 completionRate: number;
}


const HabitTrackerDashboard: React.FC = () => {
 // Example data - replace this with actual data from your backend
 const [liveData] = useState<HabitData[]>([
   { name: "Meditation", completionRate: 80 },
   { name: "Exercise", completionRate: 60 },
   { name: "Reading", completionRate: 90 },
   { name: "Journaling", completionRate: 70 },
 ]);
 const [todayData] = useState<HabitData[]>([
   { name: "Meditation", completionRate: 100 },
   { name: "Exercise", completionRate: 0 },
   { name: "Reading", completionRate: 100 },
   { name: "Journaling", completionRate: 100 },
 ]);
 const [tenDaysData] = useState<HabitData[]>([
   { name: "Meditation", completionRate: 70 },
   { name: "Exercise", completionRate: 50 },
   { name: "Reading", completionRate: 80 },
   { name: "Journaling", completionRate: 60 },
 ]);
 const [monthData] = useState<HabitData[]>([
   { name: "Meditation", completionRate: 75 },
   { name: "Exercise", completionRate: 65 },
   { name: "Reading", completionRate: 85 },
   { name: "Journaling", completionRate: 70 },
 ]);


 const renderHabitChart = (data: HabitData[], title: string) => (
   <Card className="border-[#C0C0C0] mb-6">
     <CardHeader className="bg-[#0F52BA] text-white">
       <CardTitle className="text-lg">{title}</CardTitle>
       <CardDescription className="text-[#87CEEB]">Habit completion rates</CardDescription>
     </CardHeader>
     <CardContent className="bg-white p-6">
       <ResponsiveContainer width="100%" height={300}>
         <BarChart data={data}>
           <XAxis dataKey="name" />
           <YAxis domain={[0, 100]} />
           <Tooltip />
           <Legend />
           <Bar dataKey="completionRate" fill="#0F52BA" name="Completion Rate (%)" />
         </BarChart>
       </ResponsiveContainer>
     </CardContent>
   </Card>
 );


 return (
   <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
     <h1 className="text-xl font-bold mb-8 text-[#0F52BA]">Habit Tracker</h1>


     <Tabs defaultValue="live" className="mb-12">
       <TabsList className="bg-[#0F52BA] text-white">
         <TabsTrigger value="live" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Live Data</TabsTrigger>
         <TabsTrigger value="today" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Current day Data</TabsTrigger>
         <TabsTrigger value="tenDays" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">Last 10 Days</TabsTrigger>
         <TabsTrigger value="month" className="data-[state=active]:bg-[#87CEEB] data-[state=active]:text-[#2C3E50]">This Month</TabsTrigger>
       </TabsList>


       <TabsContent value="live">
         {renderHabitChart(liveData, "Live Habit Completion Rates")}
       </TabsContent>


       <TabsContent value="today">
         {renderHabitChart(todayData, "Current day Habit Completion Rates")}
       </TabsContent>


       <TabsContent value="tenDays">
         {renderHabitChart(tenDaysData, "Last 10 Days Habit Completion Rates")}
       </TabsContent>


       <TabsContent value="month">
         {renderHabitChart(monthData, "This Month Habit Completion Rates")}
       </TabsContent>
     </Tabs>
   </div>
 );
};


export default HabitTrackerDashboard;