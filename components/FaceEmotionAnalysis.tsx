import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import toast, { Toaster, ToastBar } from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FaceEmotionPieChartProps {
  emotionData: any;
}

const FaceEmotionPieChart: React.FC<FaceEmotionPieChartProps> = ({ emotionData }) => {
  const [toastShown, setToastShown] = useState(false);
  const emotions = emotionData.output?.emotion || {};

  // Define how each emotion contributes to tiredness
  const tirednessContributions = {
    Happy:0,
    Sad: 1,
    Angry: 0.5,
    Surprise: 0.5,
    Neutral: 1,
    Disgust: 0.5,
    Fear: 1,
  };

  // Compute the tiredness score
  const tirednessScore = Object.keys(emotions).reduce((total, emotion) => {
    const contribution = tirednessContributions[emotion as keyof typeof tirednessContributions] || 0;
    return total + (emotions[emotion] * contribution);
  }, 0);

  // Add tiredness to the emotions object
  const updatedEmotions = { ...emotions, Tiredness: tirednessScore };

  // Show toast notification if tiredness score exceeds 50
  useEffect(() => {
    if (tirednessScore > 0.7 && !toastShown) {
      toast(
        (t) => (
          <div>
            <strong>You look tired!</strong> Would you like to:
            <ul className="mt-2">
              <li>
                <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Listen to music
                </a>
              </li>
              <li>
                <a href="https://www.headspace.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Practice mindfulness
                </a>
              </li>
              <li>
                <a href="https://www.coolmathgames.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Play a game
                </a>
              </li>
            </ul>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-2 text-red-500 underline"
            >
              Close
            </button>
          </div>
        ),
        { duration: 10000 }
      );
      setToastShown(true);
    }
  }, [tirednessScore, toastShown]);

  const data = {
    labels: Object.keys(updatedEmotions),
    datasets: [
      {
        label: 'Emotions',
        data: Object.values(updatedEmotions),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Happy
          'rgba(54, 162, 235, 0.6)', // Sad
          'rgba(255, 99, 132, 0.6)', // Angry
          'rgba(255, 206, 86, 0.6)', // Surprise
          'rgba(201, 203, 207, 0.6)', // Neutral
          'rgba(153, 102, 255, 0.6)', // Disgust
          'rgba(255, 159, 64, 0.6)', // Fear
          'rgba(128, 128, 128, 0.6)', // Tiredness (gray)
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // Happy
          'rgba(54, 162, 235, 1)', // Sad
          'rgba(255, 99, 132, 1)', // Angry
          'rgba(255, 206, 86, 1)', // Surprise
          'rgba(201, 203, 207, 1)', // Neutral
          'rgba(153, 102, 255, 1)', // Disgust
          'rgba(255, 159, 64, 1)', // Fear
          'rgba(128, 128, 128, 1)', // Tiredness (gray)
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-bold mb-2">Face Emotion Analysis</h3>
      <div className="relative w-64 h-64">
        <Pie data={data} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="mt-4 text-lg">
        <strong>Tiredness Score:</strong> {tirednessScore.toFixed(2)}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default FaceEmotionPieChart;
