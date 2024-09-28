import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import EmotionalWellbeingMetrics from './EmotionalWellbeingMetrics';

const EmotionalWellbeingSection: React.FC = () => {
  return (
    <Card className="bg-white rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.1)]"> {/* Reduced height */}
      <CardContent className="p-3 h-full"> 
        <EmotionalWellbeingMetrics />
      </CardContent>
    </Card>
  );
};

export default EmotionalWellbeingSection;