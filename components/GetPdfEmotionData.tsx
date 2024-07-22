"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Separator } from "@radix-ui/react-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";

type PdfEmotionData = {
  id: number;
  timestamp: string;
  userId: string;
  dominantEmotion: string;
  happy: number;
  angry: number;
  disgust: number;
  fear: number;
  neutral: number;
  sad: number;
  surprise: number;
};

const chartConfig = {
  happy: { label: "Happy", color: "hsl(var(--chart-1))" },
  angry: { label: "Angry", color: "hsl(var(--chart-2))" },
  disgust: { label: "Disgust", color: "hsl(var(--chart-3))" },
  fear: { label: "Fear", color: "hsl(var(--chart-4))" },
  neutral: { label: "Neutral", color: "hsl(var(--chart-5))" },
  sad: { label: "Sad", color: "hsl(var(--chart-6))" },
  surprise: { label: "Surprise", color: "hsl(var(--chart-7))" },
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
];

const GetPdfEmotionData: React.FC = () => {
  const [data, setData] = useState<PdfEmotionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/api/get-pdf-emotions-data");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch PDFs", error);
      }
      setIsLoading(false);
    };
    fetchPdfs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!Array.isArray(data)) {
    return (
      <div className="flex h-full justify-center items-center">
        <p>Unexpected data format received...</p>
      </div>
    );
  }

  if (!data) {
    return <div>No PDFs found</div>;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Emotions levels</CardTitle>
          <CardDescription>Emotions levels every 10 seconds</CardDescription>
        </div>
      </CardHeader>
      
     
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp size={24} />
          <span>Emotions levels</span>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total emotions levels for today
        </div>
      </CardFooter>
    </Card>
  );
};

export default GetPdfEmotionData;
