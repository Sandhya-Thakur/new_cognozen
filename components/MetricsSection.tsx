import React from 'react';
import ReadingMetric from './ReadingMetric';
import QuizMetrics from './QuizMetrics';
import EmotionsAttentionMetrics from './EmotionsAttentionMetrics';

const MetricsSection: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <ReadingMetric />
        </div>
        <div className="lg:col-span-1">
          <QuizMetrics />
        </div>
        <div className="lg:col-span-2">
          <EmotionsAttentionMetrics />
        </div>
      </div>
    </div>
  );
};

export default MetricsSection;