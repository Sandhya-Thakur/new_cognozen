import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MetricProps {
  label: string;
  value: number;
  change: number;
  progress: number;
}

const ReadingMetric: React.FC = () => {
  const [metric, setMetric] = useState<MetricProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    const fetchReadingMetric = async () => {
      try {
        const response = await fetch("/api/reading-metrics");
        if (!response.ok) {
          throw new Error("Failed to fetch reading metric");
        }
        const data = await response.json();
        setMetric(data);
      } catch (error) {
        console.error("Error fetching reading metric:", error);
        setError("Failed to load reading metric");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadingMetric();
  }, []);

  if (isLoading) return <div>Loading reading metric...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metric) return null;

  return (
    <TooltipProvider>
      <div className="relative">
        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgLz4KICA8cGF0aCBkPSJNMzAgMzBtLTI4LjUgMGEyOC41IDI4LjUgMCAxIDAgNTcgMGEyOC41IDI4LjUgMCAxIDAgLTU3IDBsNTcgME0zMCAzMG0tMjcgMGEyNyAyNyAwIDEgMCA1NCAwYTI3IDI3IDAgMSAwIC01NCAwbDU0IDBNMzAgMzBtLTI1LjUgMGEyNS41IDI1LjUgMCAxIDAgNTEgMGEyNS41IDI1LjUgMCAxIDAgLTUxIDBsNTEgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIiAvPgo8L3N2Zz4=')] opacity-30"></div>
          <CardHeader className="pb-1 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Reading Metrics
              </CardTitle>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <button className="focus:outline-none">
                    <InfoIcon className="w-5 h-5 text-white opacity-80" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-64 p-4 z-50 bg-white text-gray-800">
                  <h4 className="font-semibold mb-2">PDF Reading Activity</h4>
                  <p className="text-sm mb-2">
                    This card shows your PDF reading activity over the last 30
                    days.
                  </p>
                  <p className="text-sm mb-2">
                    Track your reading progress and engagement.
                  </p>
                  <p className="text-sm mb-2">
                    The main number represents your total PDF reading sessions.
                  </p>
                  <p className="text-sm mb-2">
                    The percentage shows the change compared to the previous 30
                    days.
                  </p>
                  <p className="text-sm">
                    The progress bar indicates your progress towards your 30-day
                    reading goal.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl font-bold">{metric.value}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${metric.change >= 0 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              <div className="relative h-2 bg-blue-300 bg-opacity-30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-white"
                  style={{
                    width: `${metric.progress}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ReadingMetric;