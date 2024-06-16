import React, { useState, useEffect, useRef } from 'react';

interface FaceAttentionAnalysisProps {
  attentionData: any;
}

const FaceAttentionAnalysis: React.FC<FaceAttentionAnalysisProps> = ({ attentionData }) => {
  const [lowAttentionDuration, setLowAttentionDuration] = useState(0);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getColorForAttention = (level: number) => {
    if (level > 75) return 'bg-green-500';
    if (level > 50) return 'bg-yellow-500';
    if (level > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Extracting the attention level from the correct path
  const attentionLevel = Math.round((attentionData?.output?.attention || 0) * 100);
  const attentionColorClass = getColorForAttention(attentionLevel);

  useEffect(() => {
    if (attentionLevel < 25) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setLowAttentionDuration((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setLowAttentionDuration(0);
      setAlertTriggered(false);
    }

    if (lowAttentionDuration >= 120 && !alertTriggered) { // Trigger alert after 2 minutes
      setAlertTriggered(true);
    }
    

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [attentionLevel, lowAttentionDuration, alertTriggered]);

  console.log('Attention Data:', attentionData); // Debug info
  console.log('Attention Level:', attentionLevel); // Debug info
  console.log('Attention Color Class:', attentionColorClass); // Debug info
  console.log('Low Attention Duration:', lowAttentionDuration); // Debug info

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-bold mb-2">Face Attention Analysis</h3>
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded h-6">
          <div
            className={`h-6 rounded ${attentionColorClass}`}
            style={{ width: `${attentionLevel}%` }}
          ></div>
        </div>
        <span className="ml-2">{attentionLevel}%</span>
      </div>
      {alertTriggered && (
        <div className="mt-2 text-red-500">
          <strong>Attention Level is Low:</strong> You have been distracted for over 5 seconds. Please stay focused!
        </div>
      )}
    </div>
  );
};

export default FaceAttentionAnalysis;
