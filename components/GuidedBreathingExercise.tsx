"use client";
import React, { useState, useEffect } from 'react';

const GuidedBreathingExercise: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            setBreathingPhase((prevPhase) => {
              if (prevPhase === 'Inhale') return 'Hold';
              if (prevPhase === 'Hold') return 'Exhale';
              if (prevPhase === 'Exhale') {
                setCycles((prevCycles) => prevCycles + 1);
                return 'Inhale';
              }
              return prevPhase; // This line should never be reached
            });
            return 4; // Reset timer to 4 seconds for each phase
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const toggleBreathingExercise = () => {
    setIsBreathing(!isBreathing);
    if (!isBreathing) {
      setBreathingPhase('Inhale');
      setTimer(4);
      setCycles(0);
    }
  };

  const getCircleStyle = () => {
    const baseStyle = "w-40 h-40 rounded-full border-4 transition-all duration-1000 flex items-center justify-center";
    switch (breathingPhase) {
      case 'Inhale':
        return `${baseStyle} border-blue-500 bg-blue-100 scale-100`;
      case 'Hold':
        return `${baseStyle} border-green-500 bg-green-100 scale-110`;
      case 'Exhale':
        return `${baseStyle} border-red-500 bg-red-100 scale-90`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Breathing Exercise</h2>
      <div className={getCircleStyle()}>
        <p className="text-2xl font-bold text-gray-800">{breathingPhase}</p>
      </div>
      <p className="text-xl mt-4 text-white">Timer: {timer}s</p>
      <p className="text-lg mt-2 text-white">Cycles: {cycles}</p>
      <button
        onClick={toggleBreathingExercise}
        className="mt-6 px-4 py-2 bg-yellow-400 text-gray-800 rounded-full hover:bg-yellow-300 transition duration-300 font-semibold"
      >
        {isBreathing ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default GuidedBreathingExercise;