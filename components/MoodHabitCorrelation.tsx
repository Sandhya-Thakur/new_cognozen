import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Habit {
  id: number;
  name: string;
}

interface Correlation {
  habitName: string;
  mood: string;
  correlationStrength: number;
  analysis: string;
}

const MoodHabitCorrelation: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestMood, setLatestMood] = useState<string | null>(null);

  useEffect(() => {
    fetchHabits();
    fetchLatestMood();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits/all');
      if (!response.ok) {
        throw new Error('Failed to fetch habits');
      }
      const data = await response.json();
      setHabits(data.habits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to fetch habits');
    }
  };

  const fetchLatestMood = async () => {
    try {
      const response = await fetch('/api/get-latest-mood');
      if (!response.ok) {
        throw new Error('Failed to fetch latest mood');
      }
      const data = await response.json();
      setLatestMood(data.mood);
    } catch (error) {
      console.error('Error fetching latest mood:', error);
      toast.error('Failed to fetch latest mood');
    }
  };

  const analyzeCorrelations = async () => {
    if (!latestMood) {
      toast.error('No mood data available for analysis');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/habits/generate-mood-habit-correlation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitIds: habits.map(h => h.id), latestMood }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate correlations');
      }
      const data = await response.json();
      setCorrelations(data.correlations);
      toast.success('Mood-habit correlations analyzed');
    } catch (error) {
      console.error('Error analyzing correlations:', error);
      toast.error('Failed to analyze mood-habit correlations');
      setError('Failed to analyze mood-habit correlations');
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    return {
      labels: correlations.map(corr => corr.habitName),
      datasets: [
        {
          label: 'Correlation Strength',
          data: correlations.map(corr => corr.correlationStrength),
          backgroundColor: correlations.map(corr => 
            corr.correlationStrength > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
          ),
          borderColor: correlations.map(corr => 
            corr.correlationStrength > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Mood-Habit Correlation Strengths',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Correlation Strength'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Mood-Habit Correlation Analysis</h3>
      {latestMood && (
        <div className="mb-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-lg">
            <span className="font-semibold">Your Latest Mood:</span> {latestMood}
          </p>
        </div>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={analyzeCorrelations}
        disabled={isLoading || habits.length === 0 || !latestMood}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Mood-Habit Correlations'}
      </motion.button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <AnimatePresence>
        {correlations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="w-full h-64 mb-6">
              <Bar data={getChartData()} options={chartOptions} />
            </div>
            
            <div className="mt-4">
              <h5 className="text-lg font-semibold mb-2 text-gray-700">Correlation Analyses</h5>
              {correlations.map((corr, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300"
                >
                  <p className="font-semibold">{corr.habitName}</p>
                  <p><span className="font-semibold">Correlation with Latest Mood:</span> {corr.mood}</p>
                  <p><span className="font-semibold">Correlation Strength:</span> {corr.correlationStrength.toFixed(2)}</p>
                  <p><span className="font-semibold">Analysis:</span> {corr.analysis}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodHabitCorrelation;