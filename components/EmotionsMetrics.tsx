import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface EmotionMetric {
  readingEmotions: {
    avgHappy: number;
    avgSad: number;
    avgAngry: number;
    avgSurprise: number;
    avgNeutral: number;
  };
  quizEmotions: {
    avgHappy: number;
    avgSad: number;
    avgAngry: number;
    avgSurprise: number;
    avgNeutral: number;
  };
  dominantEmotion: string;
  emotionsChange: number;
}

const EmotionMetrics: React.FC = () => {
  const [metric, setMetric] = useState<EmotionMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    const fetchEmotionMetrics = async () => {
      try {
        const response = await fetch("/api/emotions-attention-metrics");
        if (!response.ok) {
          throw new Error("Failed to fetch emotion metrics");
        }
        const data = await response.json();
        setMetric(data);
      } catch (error) {
        console.error("Error fetching emotion metrics:", error);
        setError("Failed to load emotion metrics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmotionMetrics();
  }, []);

  if (isLoading) return <div>Loading emotion metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metric) return null;

  const calculateOverallEmotion = () => {
    const readingSum = Object.values(metric.readingEmotions).reduce((a, b) => a + b, 0);
    const quizSum = Object.values(metric.quizEmotions).reduce((a, b) => a + b, 0);
    return ((readingSum + quizSum) / 10); // Assuming the API returns values between 0 and 1, and we have 5 emotions each for reading and quiz
  };

  const emotionValue = calculateOverallEmotion() * 100;

  return (
    <TooltipProvider>
      <div className="relative">
      <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgLz4KICA8cGF0aCBkPSJNMzAgMzBtLTI4LjUgMGEyOC41IDI4LjUgMCAxIDAgNTcgMGEyOC41IDI4LjUgMCAxIDAgLTU3IDBsNTcgME0zMCAzMG0tMjcgMGEyNyAyNyAwIDEgMCA1NCAwYTI3IDI3IDAgMSAwIC01NCAwbDU0IDBNMzAgMzBtLTI1LjUgMGEyNS41IDI1LjUgMCAxIDAgNTEgMGEyNS41IDI1LjUgMCAxIDAgLTUxIDBsNTEgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIiAvPgo8L3N2Zz4=')] opacity-30"></div>
          <CardHeader className="pb-1 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Emotion
              </CardTitle>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <button className="focus:outline-none">
                    <InfoIcon className="w-5 h-5 text-white opacity-80" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-64 p-4 z-50 bg-white text-gray-800">
                  <h4 className="font-semibold mb-2">Emotion Metrics</h4>
                  <p className="text-sm mb-2">
                    This card shows your overall emotional state during learning activities.
                  </p>
                  <p className="text-sm mb-2">
                    The main value represents your emotional positivity level.
                  </p>
                  <p className="text-sm mb-2">
                    The percentage shows the change in emotional state compared to the previous period.
                  </p>
                  <p className="text-sm">
                    The progress bar indicates your current emotional positivity level.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl font-bold">{emotionValue.toFixed(1)}%</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  metric.emotionsChange >= 0 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800'
                }`}>
                  {metric.emotionsChange >= 0 ? '+' : ''}{metric.emotionsChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              <div className="relative h-2 bg-blue-300 bg-opacity-30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-white"
                  style={{
                    width: `${emotionValue}%`,
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

export default EmotionMetrics;