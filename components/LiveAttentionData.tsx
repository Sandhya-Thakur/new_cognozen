import React, { useEffect, useState } from 'react';
import { useStore } from "@/lib/store";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LiveAttentionData = () => {
  const latestAttentionData = useStore((state) => state.latestAttentionData);
  const [attentionHistory, setAttentionHistory] = useState<number[]>([]);

  useEffect(() => {
    if (latestAttentionData) {
      setAttentionHistory(prev => [...prev, latestAttentionData.output.attention].slice(-20));
    }
  }, [latestAttentionData]);

  const data = {
    labels: attentionHistory.map((_, index) => index.toString()),
    datasets: [
      {
        label: 'Attention',
        data: attentionHistory,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Live Attention Data'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  };

  if (!latestAttentionData) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
      <p className="mt-2">Current Attention: {(latestAttentionData.output.attention * 100).toFixed(2)}%</p>
    </div>
  );
};

export default LiveAttentionData;