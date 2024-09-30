import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const DailyProgressSection = () => {
  const dailyProgress = [
    { day: 'Mo', progress: 49 },
    { day: 'Tu', progress: 31 },
    { day: 'We', progress: 77 },
    { day: 'Th', progress: 50 },
    { day: 'Fr', progress: 68 },
    { day: 'Sa', progress: 91 },
    { day: 'Su', progress: 57 },
  ];

  const getPlantColor = (progress: number) => {
    if (progress < 33) return 'from-green-200 to-green-400';
    if (progress < 66) return 'from-green-300 to-green-500';
    return 'from-green-400 to-green-600';
  };

  return (
    <Card className="bg-white rounded-3xl shadow-lg p-4 w-full max-w-[1600px]"> {/* Increased the max width */}
      <CardContent className="p-0">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Last 4 days Growth Garden</h2>
        <div className="flex justify-start items-end h-[400px] bg-[url('/api/placeholder/800/400')] bg-cover bg-bottom rounded-xl p-4 space-x-4 overflow-x-auto"> {/* Added overflow-x-auto to handle any overflow */}
          {dailyProgress.map((day, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className={`w-6 rounded-t-full bg-gradient-to-t ${getPlantColor(day.progress)}`} // Width is kept reduced (w-6)
                initial={{ height: 0 }}
                animate={{ height: `${day.progress * 3}px` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <motion.div
                  className="w-8 h-8 -mt-8 -ml-1 text-green-800" // Leaf size adjusted for the new bar width
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  🍃
                </motion.div>
              </motion.div>
              <div className="bg-white rounded-full py-1 text-xs font-bold text-green-800">
                {day.progress}%
              </div>
              <span className="text-sm font-medium text-green-800">{day.day}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgressSection;
