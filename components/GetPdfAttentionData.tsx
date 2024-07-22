"use client";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";

type PdfAttentionData = {
  id: number;
  level: number;
  timestamp: string;
  userId: string;
};

const chartConfig = {
  level: {
    label: "Attention Level",
    color: "#0F52BA", // Sapphire color
  },
} satisfies ChartConfig;

const GetPdfAttentionData: React.FC = () => {
  const [data, setData] = useState<PdfAttentionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/api/get-pdf-attention-data");
        setData(response.data);
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

  const formattedData = data.map((item) => ({
    dateTime: new Date(item.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    level: item.level,
  }));

  return (
    <Card className="w-96">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Attention Levels</CardTitle>
          <CardDescription>attention levels every seconds</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dateTime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="level"
              type="step"
              fill="#0F52BA" // Sapphire color
              fillOpacity={0.4}
              stroke="#0F52BA" // Sapphire color
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GetPdfAttentionData;
