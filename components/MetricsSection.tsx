import React from 'react';
import ReadingMetric from './ReadingMetric';
import QuizMetrics from './QuizMetrics';
import AttentionMetrics from './EmotionsAttentionMetrics';
import EmotionMetrics from "./EmotionsMetrics";
import EmotionalWellbeingSection from "./EmotionalWellbeingSection"

const MetricsSection: React.FC = () => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <ReadingMetric />
        <QuizMetrics />
        <AttentionMetrics />
        <EmotionMetrics />
        <EmotionalWellbeingSection/>
      </div>
    </div>
  );
};

export default MetricsSection;