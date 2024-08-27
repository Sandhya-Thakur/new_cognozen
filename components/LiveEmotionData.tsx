import React, { useEffect, useState } from 'react';
import { useStore } from "@/lib/store";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LiveEmotionData = () => {
  const latestEmotionData = useStore((state) => state.latestEmotionData);
  const [emotionHistory, setEmotionHistory] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    if (latestEmotionData) {
      setEmotionHistory(prev => {
        const newHistory = { ...prev };
        Object.entries(latestEmotionData.output.emotion).forEach(([emotion, value]) => {
          newHistory[emotion] = [...(newHistory[emotion] || []), value as number].slice(-20);
        });
        return newHistory;
      });
    }
  }, [latestEmotionData]);

  const data = {
    labels: Object.keys(emotionHistory),
    datasets: [
      {
        label: 'Emotions',
        data: Object.values(emotionHistory).map(values => values[values.length - 1] || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Live Emotion Data'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  };

  if (!latestEmotionData) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Bar data={data} options={options} />
      <p className="mt-2">Dominant Emotion: {latestEmotionData.output.dominantEmotion}</p>
    </div>
  );
};

export default LiveEmotionData;