import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import EmotionalWellbeingMetrics from './EmotionalWellbeingMetrics';

const EmotionalWellbeingSection: React.FC = () => {
  return (
    <Card className="bg-white w-[250px] h-[170px] rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.1)] ml-4 pl-4"> 
      <CardContent className="p-3 h-full"> 
        <EmotionalWellbeingMetrics />
      </CardContent>
    </Card>
  );
};

export default EmotionalWellbeingSection;